import Taro from "@tarojs/taro";
import { useEffect, useState } from "react";
import { View, Text, Button, Textarea, Picker } from "@tarojs/components";
import "./index.scss";

interface Question {
  id: number;
  title: string;
  description: string;
}

const questions: Question[] = [
  {
    id: 1,
    title: "Two Sum",
    description:
      "Given an array of integers, return indices of the two numbers such that they add up to a specific target.",
  },
  {
    id: 2,
    title: "Reverse String",
    description:
      "Write a function that reverses a string. The input string is given as an array of characters.",
  },
  // 添加更多问题
];

const QuestionPage = () => {
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

  const handleSubmit = () => {
    if (selectedQuestion) {
      Taro.showToast({
        title: "Answer submitted!",
        icon: "success",
        duration: 2000,
      });
      console.log(`Question: ${selectedQuestion.title}, Answer: ${answer}`);
    }
  };

  return (
    <View className="question-page">
      <View className="header">
        <Text className="title">Coding Interview Q&A</Text>
        <Text className="description">
          Select a question from the list and provide your answer.
        </Text>
      </View>

      <Picker
        mode="selector"
        range={questions.map((q) => q.title)}
        onChange={handleQuestionChange}
      >
        <View className="picker">
          <Text>
            {selectedQuestion ? selectedQuestion.title : "Select a question"}
          </Text>
        </View>
      </Picker>

      {selectedQuestion && (
        <View className="question-detail">
          <Text className="question-title">{selectedQuestion.title}</Text>
          <Text className="question-description">
            {selectedQuestion.description}
          </Text>
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
