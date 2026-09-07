export interface CreateReadingDto {
  readonly deviceId: string;
  readonly question: string | null;
  readonly ringPosition: number;
  readonly answer: 'yes' | 'no';
}
