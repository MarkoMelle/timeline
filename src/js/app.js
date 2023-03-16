import TimelineForm from './TimelineForm';
import TimelineList from './TimelineList';

document.addEventListener('DOMContentLoaded', () => {
  const timelineListDom = document.querySelector('.timeline__list');
  const timelineList = new TimelineList(timelineListDom);
  const timelineFormDom = document.querySelector('.new-step');
  const timelineForm = new TimelineForm(timelineFormDom, timelineList);
  timelineForm.init();
});
