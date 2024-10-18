import Taro from "@tarojs/taro";
import { useEffect, useState } from "react";
import { View, Text, Button, Textarea, Picker } from "@tarojs/components";
import "./index.scss";
import { getQuestionList, Question } from "@/apis/question";

const [questions, setQuestionList] = useState<Question[]>([]);

async function fetchQuestion() {
  const questionListRes = await getQuestionList();
  setQuestionList(() => {
    return [...questionListRes];
  });
}

const QuestionPage = () => {
  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(
    null
  );
  const [answer, setAnswer] = useState<string>("");
  const [questionId, setQuestionId] = useState<number>(0);

  useEffect(() => {
    if (questions.length > 0) {
      setSelectedQuestion(questions[0]);
    }
  }, []);

  const handleQuestionChange = (e) => {
    const index = e.detail.value;
    setQuestionId(index);
    const findedQuestion = questions.find((item) => item.id);
    if (findedQuestion) {
      setSelectedQuestion(findedQuestion);
    }
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
