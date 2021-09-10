import React from 'react';
import { useSelector , useDispatch } from 'react-redux';
import { increment, decrement } from './actions';
import PropTypes from "prop-types";

function Count() {
    const counter = useSelector(state => state.counter);
    //const logged = useSelector(state => state.logged);
    const dispatch = useDispatch();
    return (
        <div className="Counter">
            <h1>Counter {counter}</h1>
            <button onClick={() => dispatch(increment())}>+</button>
            <button onClick={() => dispatch(decrement())}>-</button>
        </div>
    )
}

export class Counter extends React.Component {
    constructor(props) {
        super(props)
    }

    render() {
        return (
            <div>
                <Count/>
                <button onClick={() => this.props.history.push("/login")}>To Login</button>
            </div>
        )
    }
}

Counter.propTypes = {
    history: PropTypes.object.isRequired
};

export default Counter;



//{logged ? <h3>Secret info that I shouldn't see</h3> : ''}