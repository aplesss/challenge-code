import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('options')
export class Option {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  question_id: number;

  @Column()
  option_text: string;

  @Column({ type: 'boolean', default: false })
  is_correct: boolean;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;
}
