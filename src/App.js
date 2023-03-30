import React, { useEffect, useState } from 'react';
import Libre from './Components/Libre';
import Predefinidas from './Components/Predefinidas';
import Header from './Components/Header';
import Footer from './Components/Footer';
import { InlineMath } from 'react-katex';

function App() {
  const initialEquation = 'x_f - x_i = v_i*t+(1/2)(a)(t^2)';
  const initialVariable = 'a';

  const [suma, setSuma] = useState('');
  //Determina le ecuación inicial
  const [equation, setEquation] = useState(initialEquation);

  //Ecuación temperal que el usuario digita y luego añade
  const [changingEquation, setChangingEquation] = useState(initialEquation);

  //Variable que se utiliza como referencia para la revisión automática
  const [variable, setVariable] = useState(initialVariable);

  //Variable actual
  const [currentVariable, setcurrentVariable] = useState(initialVariable);

  //Operacion actual
  const [currentFactor, setCurrentFactor] = useState('1');

  //Registro de operaciones
  const [history, setHistory] = useState([initialEquation]);

  //Modo: Predefinidas vs Libre
  const [isFreeMode, setFreeMode] = useState(false);

  //Actualiza la operación actual a utilizar
  function changeCurrentFactor(currentFactor) {
    setCurrentFactor(currentFactor);
  }

  //Modifica la ecuación actual
  function addToHistory() {
    setHistory((history) => [...history, changingEquation]);
  }

  //Actualiza la variable actual
  function updateCurrentVariable(currentVariable) {
    setVariable(currentVariable);
  }

  const submitEquation = (e) => {
    e.preventDefault();
    addToHistory(changingEquation);
    setCurrentFactor('');
  };

  const clearEquation = () => {
    addToHistory('');
    setCurrentFactor('');
  };

  const goBack = () => {
    if (history.length === 1) {
      alert('No quedan acciones por deshacer');
    } else {
      setHistory((history) => history.slice(0, history.length - 1));
    }
  };
  //Cada vez que cambia la ecuación actual, se agrega al historial,

  useEffect(() => {
    setEquation(history[history.length - 1]);
  }, [history]);

  useEffect(() => {

    fetch('/suma', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(
        { equation : '\\frac {1 + \\sqrt {\\a}} {\\b} = x^2', factor : 'b' })
    })
      .then(response => response.json())
      .then(data => {
        setSuma(data);
        console.log(data)
      });

  }, []);


  //Actualiza la variable actual
  const submitVariable = (e) => {
    e.preventDefault();
    updateCurrentVariable(currentVariable);
  };

  const handleEquationChange = (e) => {
    setChangingEquation(e.target.value);
  };

  const handleVariableChange = (e) => {
    setcurrentVariable(e.target.value);
  };

  const handleOperation = (modifiedEquation) => {
    setHistory((history) => [...history, modifiedEquation]);
  };
  const handlePredefinedEquation = (equation) => {
    setChangingEquation(equation);
    setHistory((history) => [...history, equation]);
  };

  const cambiarModo = () => {
    setFreeMode((isFreeMode) => !isFreeMode);
  };

  const funcionalidad = () => {
    if (isFreeMode) {
      return (
        <Libre
          submitEquation={submitEquation}
          handleEquationChange={handleEquationChange}
          equation={equation}
          goBack={goBack}
          clearEquation={clearEquation}
          handleOperation={handleOperation}
          currentFactor={currentFactor}
          changeCurrentFactor={changeCurrentFactor}
          submitVariable={submitVariable}
          variable={variable}
          handleVariableChange={handleVariableChange}
        />
      );
    } else {
      return (
        <Predefinidas
          submitEquation={submitEquation}
          handlePredefinedEquation={handlePredefinedEquation}
          equation={equation}
          goBack={goBack}
          clearEquation={clearEquation}
          handleOperation={handleOperation}
          currentFactor={currentFactor}
          changeCurrentFactor={changeCurrentFactor}
          submitVariable={submitVariable}
          variable={variable}
          handleVariableChange={handleVariableChange}
        />
      );
    }
  };

  return (
    <div className='flex flex-col'>
      <Header />
      <div className='w-full p-12 text-center'>
      <InlineMath math={suma.result}/>
      </div>
      <div className='grow justify-center'>
        <button onClick={cambiarModo}>Cambiar modo</button>
        <div className='grid grid-cols-4 items-center gap-4 px-12'>
          {funcionalidad()}
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default App;
