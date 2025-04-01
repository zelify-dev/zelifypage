export interface Option {
  text: string;
  score: number;
}

export interface Question {
  id: string;
  criterion: string;
  question: string;
  questionEs: string;
  options: Option[];
  optionsEs: Option[];
  hasAdditionalComments?: boolean;
  rubric: {
    [key: number]: string;
  };
} 