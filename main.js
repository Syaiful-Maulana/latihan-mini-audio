import './style.css';
import { convertTime } from './utils';

const AudioContext = window.AudioContext ?? window.webkitAudioContext;
const audioCtx = new AudioContext(); //audiocontext adalah sebuah representasi sebuah audio braff. ini adalah untuk cara kita memanipulasi audio yang sedang di play atau di pause di dalam browser

const audioElement = document.getElementById('audio');
const playBtn = document.getElementById('playbtn');
const volumeSlider = document.getElementById('volume');
const seeker = document.getElementById('seeker');
const time = document.getElementById('time');
const duration = document.getElementById('duration');

const audioSource = audioCtx.createMediaElementSource(audioElement);

window.addEventListener('load', () => {
  time.textContent = convertTime(audioElement.currentTime);
  duration.textContent = convertTime(audioElement.duration);
});

playBtn.addEventListener('click', (event) => {
  const targetEl = event.target;

  if (audioCtx === 'suspended') {
    audioCtx.resume; // jika mendapatkan isu sebuah audio tidak muncul bisa menambah kan script ini
  }

  if (targetEl.getAttribute('class') === 'paused') {
    audioElement.play();
    targetEl.setAttribute('class', 'playing');
  } else if (targetEl.getAttribute('class') === 'playing') {
    audioElement.pause();
    targetEl.setAttribute('class', 'paused');
  }
});

audioElement.addEventListener('ended', () => {
  playBtn.setAttribute('class', 'paused');
});

audioElement.addEventListener('timeupdate', () => {
  seeker.value = audioElement.currentTime;
  time.textContent = convertTime(audioElement.currentTime);
});

// Seekder control
seeker.setAttribute('max', audioElement.duration); // untuk menghilangkan bug

seeker.addEventListener('input', () => {
  audioElement.currentTime = seeker.value;
});

// audiocontext create gain yaitu method dari audiocontext yang akan mengjust volume dari audio yang akan kita jalankan
const gainNode = audioCtx.createGain();

volumeSlider.addEventListener('input', () => {
  gainNode.gain.value = volumeSlider.value;
});

// audiocontext destination adalah destinasi akhir dimana audio kita akan disuarakan. dan audiocontext destination yang menghandle dari sisi browser untuk diteruskan ke hardware atau speaker

// connect our graph
audioSource.connect(gainNode).connect(audioCtx.destination);
