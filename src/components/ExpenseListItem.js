import React from 'react';
import { Link } from 'react-router-dom';
import moment from 'moment';
import numeral from 'numeral';

const ExpenseListItem = ({ id, description, amount, createdAt, done }) => {
  let is_done = done==='true' ? 'done' : 'not_done';
  let bg_color = done==='true' ? '#66ffe0' : '#ff8080';
  return (
    <div>
  <Link className="list-item" to={`/edit/${id}`} style={{ backgroundColor: bg_color }}>
    <div >
      <h3 className="list-item__title">{description}</h3>
      <span className="list-item__sub-title">{moment(createdAt).format('MMMM Do, YYYY')}</span>
    </div>
    <h3 className="list-item__data">{numeral(amount / 100).format('0,0.00')} rs.</h3>
  </Link>
  </div>
)};

export default ExpenseListItem;
