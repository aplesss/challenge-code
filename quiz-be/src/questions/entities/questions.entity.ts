import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('questions')
export class Question {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  quiz_id: number;

  @Column()
  question_text: string;

  @Column({
    type: 'enum',
    enum: ['MULTIPLE_CHOICE', 'TRUE_FALSE', 'SHORT_ANSWER'],
  })
  question_type: string;

  @Column()
  created_at: string;
}
