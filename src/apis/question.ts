import ApiService from "../service/request/http";

const questionApiService = new ApiService("http://localhost:3005");

export type Question = {
  id: string;
  content: string;
  answer: string;
  createdAt: string;
  updatedAt: string;
};

export type Answer = {
  id: string;
  user: {
    id: string;
    username?: string;
    email?: string;
    phone?: string;
  };
  question: {
    id: string;
    content?: string;
    answer?: string;
  };
  userAnswer: string;
  score: number;
  answeredAt: string;
};

export async function getQuestionList() {
  return questionApiService.get<Array<Question>>("questions");
}

export async function createAnswer() {
  return questionApiService.post<Answer>("user-answers");
}
