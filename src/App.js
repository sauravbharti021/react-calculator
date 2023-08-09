import './style.css'
import { useReducer } from 'react'
import DigitButton from './DigitButton';
import OperationButton from './OperationButton';
function reducer(state, action){

  const {type, payload} = action;
  switch(type){
    case ACTION_TYPES.ADD_DIGIT:
      if(state.overwrite) {
        return{
          ...state,
          currentOperand: payload.digit,
          overwrite: false
        }
      }
      if(payload.digit==='0' && state.currentOperand==='0') return state;
      if(payload.digit==='.' && state.currentOperand.includes('.')) return state;
      return{
        ...state,
        currentOperand: `${state.currentOperand || ""}${payload.digit}`
      }
      case ACTION_TYPES.CHOOSE_OPERATION:
        if(state.currentOperand == null && state.previousOperand== null) return state;
        if(state.currentOperand== null){
          return{
            ...state,
            operation:  payload.operation
          }
        }
        if(state.previousOperand == null){
          return{
            ...state,
            previousOperand : state.currentOperand,
            currentOperand: null,
            operation: payload.operation,
          }
        }
        return{
          ...state,
          currentOperand: evaluate(state),
          previousOperand: null,
          operation: payload.operation
        }
    case ACTION_TYPES.CLEAR:
      return {}
    case ACTION_TYPES.EVALUATE:
      if(state.currentOperand==null || state.previousOperand==null || state.operation==null) return state;
      return{
        ...state,
        overwrite:true,
        currentOperand: evaluate(state),
        previousOperand: null,
        operation: null
      }
    case ACTION_TYPES.DELETE_DIGIT:
      if(state.overwrite) return {
          ...state,
          currentOperand: null,
          overwrite: false
      }
      if(state.currentOperand.length===1){
        return {
          ...state,
          currentOperand:null
        }
      }
      return{
        ...state,
        currentOperand: state.currentOperand.slice(0, -1)
      }
  }
}

function evaluate(state){
  const {currentOperand, previousOperand, operation} = state;

    const prev= parseFloat(previousOperand)
    const curr= parseFloat(currentOperand)
    if(isNaN(prev) || isNaN(curr)) return "";
    let answer=""

    switch(operation){
      case '+':
        answer= prev+ curr
        break;
      case '-':
        answer= prev-curr
        break;
      case '*':
        answer= prev*curr
        break;
      case '÷':
        answer =prev/curr
        break;
    }
    return answer.toString();
}
export const ACTION_TYPES={
  ADD_DIGIT: 'ADD_DIGIT',
  CHOOSE_OPERATION : 'CHOOSE_OPERATION',
  CLEAR: 'CLEAR',
  DELETE_DIGIT: 'DELETE-DIGIT',
  EVALUATE: 'EVALUATE'
}
const IntegerFormatter= new Intl.NumberFormat("en-us",{
  maximumFractionDigits: 0
})
function formatter(operand){
  if(operand==null) return;
  const [integer, decimal] = operand.split('.');
  if(decimal==null) return IntegerFormatter.format(integer);
  return `${IntegerFormatter.format(integer)}.${decimal}`
}

function App() {


  const [{currentOperand, previousOperand, operation}, dispatch] = useReducer(reducer, {})

  // dispatch({type: ACTION_TYPES.ADD_DIGIT, payload:{digit: 1}})
  return (
    <div className="calculator-grid">
      <div className="output"> 
        <div className="previous-operand">{formatter(previousOperand)}{operation}</div>
        <div className="current-operand">{formatter(currentOperand)}</div>
      </div>

      <button className="span-two" onClick={()=> dispatch({type : ACTION_TYPES.CLEAR})} >AC</button>
      <button className="" onClick={()=>{dispatch({type:ACTION_TYPES.DELETE_DIGIT })}} >DEL</button>
      {/* <button>÷</button> */}

      <OperationButton operation="÷" dispatch={dispatch} />
      <DigitButton digit="1" dispatch={dispatch} />
      <DigitButton digit="2" dispatch={dispatch} />
      <DigitButton digit="3" dispatch={dispatch} />
      <OperationButton operation="*" dispatch={dispatch} />
      <DigitButton digit="4" dispatch={dispatch} />
      <DigitButton digit="5" dispatch={dispatch} />
      <DigitButton digit="6" dispatch={dispatch} />
      <OperationButton operation="+" dispatch={dispatch} />
      <DigitButton digit="7" dispatch={dispatch} />
      <DigitButton digit="8" dispatch={dispatch} />
      <DigitButton digit="9" dispatch={dispatch} />
      <OperationButton operation="-" dispatch={dispatch} />
      <DigitButton digit="." dispatch={dispatch} />
      <DigitButton digit="0" dispatch={dispatch} />
      <button className="span-two" onClick={()=>{dispatch({type: ACTION_TYPES.EVALUATE})}} >=</button>
    </div>
  );
}

export default App;
