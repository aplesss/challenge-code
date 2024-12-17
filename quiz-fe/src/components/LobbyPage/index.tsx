import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWebsocket } from '../../socketService';
import { useStartQuizMutation, useGetQuizQuery } from '../../redux/api';
import { Button, List, Typography, Spin, Alert, Space } from 'antd';
import styled from 'styled-components';
import { subscribeRealtimeEvent } from '../../socketService/utils';

const { Title, Text } = Typography;

const LobbyContainer = styled(Space)`
  width: 90%;
  max-width: 700px;
  margin: 50px auto;
  padding: 30px;

  border-radius: 12px;
  background: linear-gradient(145deg, #ffffff, #f1f1f1);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  text-align: center;
  font-family: 'Arial', sans-serif;
`;

const LobbyTitle = styled(Title)`
  font-size: 2.5em;
  color: #333;
  font-weight: bold;
  margin-bottom: 10px;
`;

const LobbyDescription = styled(Text)`
  font-size: 1.6em;
  color: #555;
  margin-bottom: 20px;
`;

const WaitingMessage = styled(Text)`
  font-size: 1.3em;
  color: #777;
  margin: 10px 0;
`;

const ParticipantsCount = styled(Text)`
  font-size: 1.3em;
  color: #777;
  margin: 10px 0;
`;

const StartButton = styled(Button)`
  padding: 12px 25px;
  font-size: 1.2em;
  color: white;
  width: 200px;
  background-color: #1677ff;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease-in-out;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
`;

const ParticipantsList = styled(List)`
  list-style-type: none;
  padding: 0;
  margin-top: 20px;
  max-height: 300px;
  overflow-y: auto;
  margin-bottom: 20px;
`;

const ParticipantItem = styled(List.Item)`
  font-size: 1.1em;
  color: #333;
  border-width: 0px;
  transition: transform 0.2s ease-out;
  &:hover {
    background-color: #d0e7f9;
    font-weight: bold;
  }
`;

const LobbyPage: React.FC = () => {
  const navigate = useNavigate();
  const socketService = useWebsocket();
  const [quizTitle, setQuizTitle] = useState<string>('');
  const [quizDescription, setQuizDescription] = useState<string>('');
  const [participantList, setParticipantList] = useState<string[]>([]);

  const quizIdentifier = sessionStorage.getItem('quizId');
  const playerName = sessionStorage.getItem('userName');

  const {
    data: quizDetails,
    isLoading,
    isError,
  } = useGetQuizQuery(quizIdentifier!, { skip: !quizIdentifier });
  const [beginQuiz, { isLoading: isQuizStarting }] = useStartQuizMutation();

  const eventHandler = useCallback(
    (eventMessage: any) => {
      if (eventMessage.type === 'new-participant-joined') {
        setParticipantList(eventMessage.payload.participants);
      }
      if (eventMessage.type === 'quiz-started') {
        navigate('/quiz');
      }
    },
    [navigate]
  );

  useEffect(() => {
    if (!quizDetails) return;

    const { title, description, participants } = quizDetails;
    setQuizTitle(title);
    setQuizDescription(description);
    setParticipantList(participants);

    if (quizIdentifier && playerName) {
      subscribeRealtimeEvent(
        socketService,
        quizIdentifier,
        playerName,
        eventHandler
      );
    }

    if (quizDetails.status === 'STARTED') {
      navigate('/quiz');
    }
  }, [
    quizDetails,
    socketService,
    quizIdentifier,
    playerName,
    navigate,
    eventHandler,
  ]);

  const startQuizHandler = async () => {
    if (quizIdentifier) {
      const isQuizStarted = await beginQuiz(quizIdentifier);
      if (isQuizStarted) {
        navigate('/quiz');
      } else {
        alert('Something went wrong, please try again');
      }
    }
  };

  if (isLoading) return <Spin size="large" />;
  if (isError)
    return (
      <Alert
        message="Error"
        description="Unable to load quiz data"
        type="error"
        showIcon
      />
    );

  return (
    <LobbyContainer direction="vertical">
      <LobbyTitle level={2}>{quizTitle}</LobbyTitle>

      <LobbyDescription>{quizDescription}</LobbyDescription>
      <WaitingMessage>
        Waiting for others to join... Or click below to start the quiz
      </WaitingMessage>
      <ParticipantsCount>
        Participants: {participantList.length}
      </ParticipantsCount>

      <StartButton
        type="primary"
        onClick={startQuizHandler}
        loading={isQuizStarting}
      >
        {isQuizStarting ? 'Starting quiz...' : 'Start quiz'}
      </StartButton>

      <ParticipantsList
        bordered
        dataSource={participantList}
        renderItem={(participant: any) => (
          <ParticipantItem>
            <Typography>{participant}</Typography>
          </ParticipantItem>
        )}
      />
    </LobbyContainer>
  );
};

export default LobbyPage;
