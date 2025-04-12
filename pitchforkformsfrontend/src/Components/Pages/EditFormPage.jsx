import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import axios from 'axios';
import DefaultFormFormat from '../DefaultFormFormat';

const EditFormPage = () => {
  const { id } = useParams();
  const [formData, setFormData] = useState(null);
  const accessToken = localStorage.getItem('accessToken');

  useEffect(() => {
    const fetchForm = async () => {
      try {
        const res = await axios.post(
          '/form/get-all',
          { form_id: id },
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        const processedQuestions = res.data.questions.map((q) => ({
          ...q,
          answers: q.answers.map((a) => ({
            ...a,
            isCorrect: a.is_right,
          })),
          isMultiple: q.answers.filter((a) => a.is_right).length > 1,
        }));

        setFormData({
          ...res.data,
          questions: processedQuestions,
        });
      } catch (err) {
        console.error('Hiba a form lekérdezésénél:', err);
      }
    };

    fetchForm();
  }, [id, accessToken]);

  const saveQuestionAttribute = (index, key, value) => {
    const updatedQuestions = [...formData.questions];
    updatedQuestions[index] = {
      ...updatedQuestions[index],
      [key]: value,
    };
    setFormData({ ...formData, questions: updatedQuestions });
  };

  const deleteQuestion = (index) => {
    const updatedQuestions = formData.questions.filter((_, i) => i !== index);
    setFormData({ ...formData, questions: updatedQuestions });
  };

  if (!formData) return <div>Betöltés...</div>;

  return (
    <div style={{ padding: 20 }}>
      <h2>{formData.name}</h2>

      {formData.questions.map((question, index) => (
        <DefaultFormFormat
          key={question.id || index}
          index={index}
          question={question}
          saveQuestionAttribute={saveQuestionAttribute}
          deleteQuestion={deleteQuestion}
        />
      ))}

      {/* Későbbi mentéshez: */}
      {/* <Button variant="contained" onClick={handleSave}>Mentés</Button> */}
    </div>
  );
};

export default EditFormPage;
