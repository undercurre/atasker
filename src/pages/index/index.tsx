import Taro from "@tarojs/taro";
import { useEffect, useState } from "react";
import { View, Text, Button, Textarea, Picker } from "@tarojs/components";
import "./index.scss";
import { createAnswer, getQuestionList, Question } from "../../apis/question";
import { localStg } from "../../service/storage/local";

const QuestionPage = () => {
  const [questions, setQuestionList] = useState<Question[]>([]);

  async function fetchQuestion() {
    const questionListRes = await getQuestionList();
    setQuestionList(() => {
      return [...questionListRes];
    });
  }

  useEffect(() => {
    fetchQuestion();
  }, []);

  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(
    null
  );
  const [answer, setAnswer] = useState<string>("");
  const [questionIndex, setQuestionIndex] = useState<number>(0);

  useEffect(() => {
    if (questions.length > 0) {
      setSelectedQuestion(questions[0]);
    }
  }, []);

  const handleQuestionChange = (e) => {
    const index = e.detail.value;
    setQuestionIndex(index);
    setSelectedQuestion(questions[index]);
  };

  const handleAnswerChange = (e) => {
    setAnswer(e.target.value);
  };

  const handleSubmit = async () => {
    if (selectedQuestion) {
      const userId = await localStg.get("userId");
      const answerParams = {
        user: {
          id: userId,
        },
        question: {
          id: questions[questionIndex].id,
        },
        userAnswer: answer,
      };
      await createAnswer(answerParams);
      Taro.showToast({
        title: "Answer submitted!",
        icon: "success",
        duration: 2000,
      });
      console.log(`Question: ${selectedQuestion.content}, Answer: ${answer}`);
    }
  };

  return (
    <View className="question-page">
      <View className="header">
        <Text className="title">Interview Exercise Q&A</Text>
        <Text className="description">
          Select a question from the list and provide your answer.
        </Text>
      </View>

      <Picker
        mode="selector"
        range={questions.map((q) => q.content)}
        onChange={handleQuestionChange}
      >
        <View className="picker">
          <Text>
            {selectedQuestion ? selectedQuestion.content : "Select a question"}
          </Text>
        </View>
      </Picker>

      {selectedQuestion && (
        <View className="question-detail">
          <Text className="question-title">Q: {selectedQuestion.content}</Text>
        </View>
      )}

      <Textarea
        className="answer-input"
        placeholder="Write your answer here..."
        value={answer}
        onInput={handleAnswerChange}
      />

      <Button className="submit-button" onClick={handleSubmit}>
        Submit Answer
      </Button>
    </View>
  );
};

export default QuestionPage;
