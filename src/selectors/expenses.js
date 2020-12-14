import moment from 'moment';

// Get visible expenses

export default (expenses, { text, sortBy, startDate, endDate, chooseBy }) => {
  let chosen_val = '';
  if(chooseBy==='done') chosen_val = 'true';
  if(chooseBy==='unDone') chosen_val = 'false';
  return expenses.filter((expense) => {
    const createdAtMoment = moment(expense.createdAt);
    const startDateMatch = startDate ? startDate.isSameOrBefore(createdAtMoment, 'day') : true;
    const endDateMatch = endDate ? endDate.isSameOrAfter(createdAtMoment, 'day') : true;
    const textMatch = expense.description.toLowerCase().includes(text.toLowerCase());
    const choseMatch = expense.done.toLowerCase().includes(chosen_val.toLowerCase());
    return startDateMatch && endDateMatch && textMatch && choseMatch;
  }).sort((a, b) => {
    if (sortBy === 'date') {
      return a.createdAt < b.createdAt ? 1 : -1;
    } else if (sortBy === 'amount') {
      return a.amount < b.amount ? 1 : -1;
    }  
  });
};
