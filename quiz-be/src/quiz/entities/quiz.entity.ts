import { Question } from 'src/questions/entities/questions.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity('quizzes')
export class Quiz {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ type: 'varchar', length: 100 })
  reference_id: string;

  @Column({ type: 'varchar', length: 100 })
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @OneToMany(() => Question, (question) => question.quiz_id, {
    cascade: true,
    orphanedRowAction: 'delete',
  })
  questions: Question[];

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;
}
