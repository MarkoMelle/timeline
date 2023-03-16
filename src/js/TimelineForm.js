import validateCoordinates from './validateCoordinates';

export default class TimelineForm {
  constructor(formElement, timelineList) {
    if (!(formElement instanceof HTMLElement)) {
      throw new Error('formElement must be valid HTMLElements');
    }
    this.form = formElement;
    this.timelineList = timelineList;
    this.input = this.form.querySelector('.new-step__textarea');
    this.sendBtn = this.form.querySelector('.new-step__send-btn');
    this.audioControl = this.form.querySelector('.new-step__audio-control');
    this.saveAudioBtn = this.form.querySelector('.new-step__save-btn');
    this.recordAudioBtn = this.form.querySelector('.new-step__record-btn');
    this.cancelAudioBtn = this.form.querySelector('.new-step__cancel-btn');
    this.recordingAudio = this.form.querySelector('.new-step__recording');
    this.timerElement = this.form.querySelector('.recording-text');
    this.mediaRecorder = null;
    this.audioChunks = [];
    this.geolocationForm = document.querySelector('.geolocation-form');
    this.geolocationInput = this.geolocationForm.querySelector(
      '.geolocation-form__input',
    );
    this.geolocationSubmit = this.geolocationForm.querySelector(
      '.geolocation-form__submit',
    );
    this.geolocationCancel = this.geolocationForm.querySelector(
      '.geolocation-form__cancel',
    );
  }

  init() {
    this.input.addEventListener('input', this.inputOnchange.bind(this));
    this.form.addEventListener('submit', this.submit.bind(this));
    this.recordAudioBtn.addEventListener(
      'click',
      this.startRecording.bind(this),
    );
    this.saveAudioBtn.addEventListener('click', this.saveRecording.bind(this));
    this.cancelAudioBtn.addEventListener(
      'click',
      this.cancelRecording.bind(this),
    );
    this.geolocationCancel.addEventListener('click', (e) => {
      e.preventDefault();
      this.geolocationForm.reset();
      this.geolocationForm.classList.add('hidden');
    });
    this.geolocationInput.addEventListener('input', (e) => {
      e.preventDefault();
      this.geolocationInput.setCustomValidity('');
    });
    this.geolocationForm.addEventListener('submit', (e) => {
      e.preventDefault();
      this.geolocationInput.setCustomValidity('');
      if (validateCoordinates(this.geolocationInput)) {
        const step = {};
        step.date = new Date().toLocaleString('ru', {
          day: '2-digit',
          month: '2-digit',
          year: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
        });
        step.location = this.geolocationInput.value;
        this.geolocationForm.classList.add('hidden');
        if (this.audioChunks.length > 0) {
          const audioBlob = new Blob(this.audioChunks, { type: 'audio/mp3' });
          const audioUrl = URL.createObjectURL(audioBlob);
          step.audio = audioUrl;
          this.timelineList.addStep('audio', step);
          this.audioChunks = [];
        } else {
          step.description = this.input.value;
          this.timelineList.addStep('text', step);
        }
        this.resetForm();
        this.sendBtn.classList.add('hidden');
        this.recordAudioBtn.classList.remove('hidden');
      } else {
        this.geolocationInput.reportValidity();
      }
    });
  }

  inputOnchange(e) {
    e.preventDefault();
    if (this.input.value.length > 0) {
      this.sendBtn.classList.remove('hidden');
      this.recordAudioBtn.classList.add('hidden');
    } else {
      this.sendBtn.classList.add('hidden');
      this.recordAudioBtn.classList.remove('hidden');
    }
  }

  async submit(e) {
    e.preventDefault();
    try {
      const step = {};
      step.date = new Date().toLocaleString('ru', {
        day: '2-digit',
        month: '2-digit',
        year: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
      });
      const position = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject);
      });
      step.location = `Координаты: ${position.coords.latitude}, ${position.coords.longitude}`;
      if (this.audioChunks.length > 0) {
        const audioBlob = new Blob(this.audioChunks, { type: 'audio/mp3' });
        const audioUrl = URL.createObjectURL(audioBlob);
        step.audio = audioUrl;
        this.timelineList.addStep('audio', step);
        this.audioChunks = [];
      } else {
        step.description = this.input.value;
        this.timelineList.addStep('text', step);
      }
      this.resetForm();
      this.form.scrollIntoView({ behavior: 'smooth' });
      this.sendBtn.classList.add('hidden');
      this.recordAudioBtn.classList.remove('hidden');
    } catch (err) {
      console.error('Error getting geolocation: ', err);
      this.geolocationForm.classList.remove('hidden');
    }
  }

  startRecording(event) {
    event.preventDefault();
    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then((stream) => {
        this.mediaRecorder = new MediaRecorder(stream);
        this.recordingCanceled = false;
        this.mediaRecorder.addEventListener('dataavailable', (e) => {
          if (!this.recordingCanceled) {
            this.audioChunks.push(e.data);
          }
        });
        this.mediaRecorder.start();
        this.input.setAttribute('disabled', 'disabled');
        this.recordingAudio.classList.remove('hidden');
        this.recordAudioBtn.classList.add('hidden');
        this.audioControl.classList.remove('hidden');
        const startTime = Date.now();
        this.timer = setInterval(() => {
          const elapsedTime = Date.now() - startTime;
          const seconds = Math.floor(elapsedTime / 1000) % 60;
          const minutes = Math.floor(elapsedTime / 1000 / 60);
          const timeString = `Rec ${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
          this.timerElement.textContent = timeString;
        }, 1000);
      })
      .catch((err) => {
        console.error('Error recording audio: ', err);
      });
  }

  saveRecording(e) {
    e.preventDefault();
    if (this.mediaRecorder && this.mediaRecorder.state !== 'inactive') {
      this.mediaRecorder.stop();
      this.mediaRecorder.stream.getTracks().forEach((track) => track.stop());
      clearInterval(this.timer);
      this.timerElement.textContent = 'Rec 00:00';
    }
    this.recordingAudio.classList.add('hidden');
    this.form.dispatchEvent(new Event('submit'));
  }

  cancelRecording(e) {
    e.preventDefault();
    if (this.mediaRecorder && this.mediaRecorder.state !== 'inactive') {
      this.mediaRecorder.stop();
      this.mediaRecorder.stream.getTracks().forEach((track) => track.stop());
      clearInterval(this.timer);
      this.timerElement.textContent = 'Rec 00:00';
    }
    this.recordingCanceled = true;
    this.resetForm();
  }

  resetForm() {
    this.form.reset();
    this.input.removeAttribute('disabled');
    this.sendBtn.classList.add('hidden');
    this.recordAudioBtn.classList.remove('hidden');
    this.audioChunks = [];
    this.mediaRecorder = null;
    this.audioControl.classList.add('hidden');
  }
}
