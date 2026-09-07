export interface LenormandCard {
  readonly number: number;
  readonly name: string;
  readonly slug: string;
  readonly playingCard: string;
  readonly meaning: string;
}

export type Answer = 'yes' | 'no';

export interface Reading {
  readonly id: number;
  readonly deviceId: string;
  readonly question: string | null;
  readonly ringPosition: number;
  readonly answer: Answer;
  readonly createdAt: string;
}

export interface ReadingInput {
  readonly deviceId: string;
  readonly question: string | null;
  readonly ringPosition: number;
  readonly answer: Answer;
}
