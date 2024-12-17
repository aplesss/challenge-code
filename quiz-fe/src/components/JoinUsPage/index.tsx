import React, { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Use the RTK Query hook
import { useSignInMutation } from '../../redux/api';
import StyledSignInPage from './styles';
import { Button, Typography, Form, Input } from 'antd';

const JoinUs: React.FC = () => {
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [formRef] = Form.useForm();
  const navigate = useNavigate();

  const [signIn, { isLoading }] = useSignInMutation();

  const handleSignIn = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      try {
        const { userName, quizId } = await formRef.validateFields();
        setLoading(true);
        await signIn({ userName, quizId }).unwrap();
        sessionStorage.setItem('userName', userName);
        sessionStorage.setItem('quizId', quizId);
        navigate('/lobby');
      } catch (error: any) {
        setError(error.message || 'Failed to sign in');
      } finally {
        setLoading(false);
      }
    },
    [formRef, navigate, signIn]
  );

  return (
    <StyledSignInPage>
      <div className="container">
        <Typography.Title level={2}>Join Us</Typography.Title>
        <Form
          className="form"
          form={formRef}
          wrapperCol={{ span: 24 }}
          labelCol={{ span: 24 }}
        >
          <Form.Item
            label="Username"
            name="userName"
            rules={[{ required: true, message: 'Please input your username!' }]}
          >
            <Input className="input" placeholder="Enter your username" />
          </Form.Item>
          <Form.Item
            label="Quiz ID"
            name="quizId"
            rules={[
              { required: true, message: 'Please input the quiz session ID!' },
            ]}
          >
            <Input className="input" placeholder="Enter quiz session ID" />
          </Form.Item>
          {error && <p className="error">{error}</p>}
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              onClick={handleSignIn}
              disabled={loading || isLoading}
            >
              {loading ? 'Joining In...' : 'Join Quiz'}
            </Button>
          </Form.Item>
        </Form>
      </div>
    </StyledSignInPage>
  );
};

export default JoinUs;
