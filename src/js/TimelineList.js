export default class TimelineList {
  constructor(listElement) {
    if (!(listElement instanceof HTMLElement)) {
      throw new Error('listElement must be valid HTMLElements');
    }
    this.list = listElement;
    this.steps = [];
  }

  addStep(type, step) {
    const timelineList = document.querySelector('.timeline__list');
    const stepElement = document.createElement('li');
    stepElement.classList.add('timeline__item', 'timeline__item--text');

    const stepIcon = document.createElement('div');
    stepIcon.classList.add('timeline__icon');

    const stepContent = document.createElement('div');
    stepContent.classList.add('timeline__content');

    const stepDate = document.createElement('span');
    stepDate.classList.add('timeline__date');
    stepDate.textContent = step.date;

    const stepLocation = document.createElement('span');
    stepLocation.classList.add('timeline__location');
    stepLocation.textContent = step.location;

    stepContent.appendChild(stepDate);
    if (type === 'text') {
      const stepDescription = document.createElement('p');
      stepDescription.classList.add('timeline__description');
      stepDescription.textContent = step.description;
      stepContent.appendChild(stepDescription);
    } else if (type === 'audio') {
      const audioElement = document.createElement('audio');
      audioElement.controls = true;
      audioElement.classList.add('timeline__audio');
      stepContent.appendChild(audioElement);
      const audioSource = document.createElement('source');
      audioSource.type = 'audio/mp3';
      audioSource.src = step.audio;

      const audioFallback = document.createTextNode(
        'Ваш браузер не поддерживает аудио',
      );
      audioElement.appendChild(audioSource);
      audioElement.appendChild(audioFallback);
    }

    stepContent.appendChild(stepLocation);

    stepElement.appendChild(stepIcon);
    stepElement.appendChild(stepContent);

    timelineList.appendChild(stepElement);
    this.steps.push(stepElement);
  }
}
