import { useState } from 'react';
import { FileText, CheckCircle, XCircle, RotateCcw } from 'lucide-react';
import { quizQuestions } from '@/data/quizQuestions';

const AssessmentPage = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [filterCategory, setFilterCategory] = useState<string>('All');

  const categories = ['All', ...Array.from(new Set(quizQuestions.map((q) => q.category)))];

  const filteredQuestions = filterCategory === 'All'
    ? quizQuestions
    : quizQuestions.filter((q) => q.category === filterCategory);

  const currentQuestion = filteredQuestions[currentQuestionIndex];

  const handleAnswerSelect = (index: number) => {
    setSelectedAnswer(index);
    setShowExplanation(true);
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < filteredQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
    }
  };

  const handleReset = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setShowExplanation(false);
  };

  const isCorrect = selectedAnswer === currentQuestion?.correctAnswer;

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="space-y-4">
        <div className="flex items-center space-x-3">
          <div className="p-3 rounded-lg bg-primary-500/10">
            <FileText className="h-8 w-8 text-primary-500" />
          </div>
          <div>
            <h1 className="text-3xl md:text-4xl font-bold">Assessment</h1>
            <p className="text-muted-foreground mt-1">
              Test your psychopharmacology knowledge
            </p>
          </div>
        </div>
      </div>

      {/* Category Filter */}
      <div className="rounded-lg border bg-card p-6">
        <h2 className="text-lg font-semibold mb-4">Filter by Category</h2>
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => {
                setFilterCategory(category);
                setCurrentQuestionIndex(0);
                setSelectedAnswer(null);
                setShowExplanation(false);
              }}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filterCategory === category
                  ? 'bg-primary-500 text-white'
                  : 'border hover:border-primary-500'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Question Card */}
      {currentQuestion && (
        <div className="rounded-lg border bg-card p-6 space-y-6">
          {/* Progress */}
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <div>
              Question {currentQuestionIndex + 1} of {filteredQuestions.length}
            </div>
            <div className="px-3 py-1 rounded-full bg-primary-500/10 text-primary-500 font-medium">
              {currentQuestion.category}
            </div>
          </div>

          {/* Question */}
          <div>
            <h2 className="text-xl font-semibold mb-4">{currentQuestion.question}</h2>
            <div className="space-y-3">
              {currentQuestion.options?.map((option, index) => {
                const isSelected = selectedAnswer === index;
                const isCorrectAnswer = index === currentQuestion.correctAnswer;
                const showCorrect = showExplanation && isCorrectAnswer;
                const showIncorrect = showExplanation && isSelected && !isCorrect;

                return (
                  <button
                    key={index}
                    onClick={() => !showExplanation && handleAnswerSelect(index)}
                    disabled={showExplanation}
                    className={`w-full p-4 rounded-lg border text-left transition-all ${
                      showCorrect
                        ? 'border-green-500 bg-green-500/10'
                        : showIncorrect
                        ? 'border-red-500 bg-red-500/10'
                        : isSelected
                        ? 'border-primary-500 bg-primary-500/10'
                        : 'hover:border-primary-500/50'
                    } ${showExplanation ? 'cursor-default' : 'cursor-pointer'}`}
                  >
                    <div className="flex items-center justify-between">
                      <span>{option}</span>
                      {showCorrect && <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 ml-2" />}
                      {showIncorrect && <XCircle className="h-5 w-5 text-red-500 flex-shrink-0 ml-2" />}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Explanation */}
          {showExplanation && (
            <div
              className={`p-4 rounded-lg border ${
                isCorrect
                  ? 'border-green-500/50 bg-green-500/5'
                  : 'border-red-500/50 bg-red-500/5'
              }`}
            >
              <div className="flex items-start space-x-3">
                {isCorrect ? (
                  <CheckCircle className="h-6 w-6 text-green-500 flex-shrink-0 mt-0.5" />
                ) : (
                  <XCircle className="h-6 w-6 text-red-500 flex-shrink-0 mt-0.5" />
                )}
                <div>
                  <h3 className={`font-semibold mb-2 ${isCorrect ? 'text-green-500' : 'text-red-500'}`}>
                    {isCorrect ? 'Correct!' : 'Incorrect'}
                  </h3>
                  <p className="text-sm text-muted-foreground">{currentQuestion.explanation}</p>
                </div>
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex items-center justify-between pt-4 border-t">
            <button
              onClick={handlePreviousQuestion}
              disabled={currentQuestionIndex === 0}
              className="px-4 py-2 rounded-lg border hover:bg-accent disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Previous
            </button>

            <button
              onClick={handleReset}
              className="px-4 py-2 rounded-lg border hover:bg-accent transition-colors flex items-center space-x-2"
            >
              <RotateCcw className="h-4 w-4" />
              <span>Reset</span>
            </button>

            <button
              onClick={handleNextQuestion}
              disabled={currentQuestionIndex === filteredQuestions.length - 1}
              className="px-4 py-2 rounded-lg bg-primary-500 text-white hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Educational Note */}
      <div className="rounded-lg border border-blue-500/20 bg-blue-500/5 p-6">
        <p className="text-sm text-muted-foreground">
          <span className="font-semibold text-blue-500">Note:</span> This assessment is designed for
          educational purposes to help reinforce learning. Questions cover key concepts, adverse effects,
          monitoring, and clinical scenarios. No scores are tracked.
        </p>
      </div>
    </div>
  );
};

export default AssessmentPage;
