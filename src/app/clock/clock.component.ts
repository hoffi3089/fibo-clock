import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-clock',
  templateUrl: './clock.component.html',
  styleUrls: ['./clock.component.css']
})


export class ClockComponent implements OnInit {
  datetext: String = '';
  currentDT: number = 0;
  fibs: number[] = [1, 1, 2, 3, 5];
  fibId = ["nr1a", "nr1b", "nr2", "nr3", "nr5"];

  nums: any = {
    nr0: [],
    nr1: [[0], [1]],
    nr2: [[0, 1], [2]],
    nr3: [[0, 2], [1, 2], [3]],
    nr4: [[0, 1, 2], [0, 3], [1, 3]],
    nr5: [[0, 1, 3], [2, 3], [4]],
    nr6: [[0, 2, 3], [1, 2, 3], [0, 4], [1, 4]],
    nr7: [[0, 1, 2, 3], [0, 1, 4], [2, 4]],
    nr8: [[3, 4], [0, 2, 4], [1, 2, 4]],
    nr9: [[0, 3, 4], [1, 3, 4]],
    nr10: [[2, 3, 4]],
    nr11: [[0, 2, 3, 4], [1, 2, 3, 4]],
    nr12: [[0, 1, 2, 3, 4]]
  };

  colors: any = {
    c0: "#fff",
    c1: "#f00",
    c2: "#0f0",
    c3: "#00f"
  };

  times: { std: number, min: number } = {
    std: -1,
    min: -1
  };

  headl = document.getElementById('h');
  constructor() { }

  ngOnInit(): void {
    let newTime: number = + new Date()
    let currentT: string = localStorage.getItem("currentDT") || ''
    if (!!parseInt(currentT)) newTime = parseInt(currentT)
    else localStorage.setItem("currentDT", newTime + '')

    this.currentDT = newTime
    this.myClock(this.currentDT)
  }

  myClock = (d: number) => {
    let roundUpHour
    let hasChanged = false

    let tempDate = getDate(d)
    this.displayCurrentTime(d)

    if (tempDate.getHours() !== this.times.std) {
      this.times.std = tempDate.getHours();
      hasChanged = true;
    }

    if (getRoundedMin(tempDate) !== this.times.min) {
      this.times.min = getRoundedMin(tempDate)
      roundUpHour = tempDate.getMinutes() > 57
      hasChanged = true;
    }

    if (hasChanged) {
      if (this.times.min === 60) {
        this.setTimes(this.times.std + 1, 0);
      } else {
        this.setTimes(this.times.std, this.times.min / 5);
      }
    }

  }

  setTimes = (std: number, minPart: number) => {
    let i, colors = [0, 0, 0, 0, 0]
    let elemente: any;

    if (std === 0) std = 12;
    if (std > 12) std = std - 12;

    if (minPart < 0) minPart = 0;
    if (minPart > 12) minPart = 12;

    elemente = this.getPositionsByRandom(std);

    for (i = 0; i < elemente.length; i = i + 1) {
      colors[elemente[i]] = 1;
    }

    elemente = this.getPositionsByRandom(minPart);

    for (i = 0; i < elemente.length; i = i + 1) {
      let pos = elemente[i];
      colors[pos] = (colors[pos] === 1) ? 3 : 2;
    }

    this.setColors(colors);
  };

  getPositionsByRandom = (stdOrMin: number) => {
    let listSetNr: string = this.nums["nr" + stdOrMin],
      rand = Math.floor(Math.random() * listSetNr.length);

    if (listSetNr.length === 0)
      return [];

    return listSetNr[rand];
  }

  setColors = (colors: any) => {
    let text = "";
    let id, elem: any;
    for (let i = 0; i < colors.length; i = i + 1) {
      id = this.fibId[i];
      elem = document.getElementById(id);
      elem.style.backgroundColor = this.colors["c" + colors[i]];
      text += "c" + colors[i] + this.colors["c" + colors[i]] + "<br>";
    }
  };


  testNums = () => {
    let text = "";
    for (let i = 0; i <= 12; i = i + 1) {
      let listeNr = this.nums["nr" + i];
      let le = listeNr.length;
      for (let j = 0; j < le; j = j + 1) {
        let listeMoegl = listeNr[j];
        let sum = 0;
        for (let k = 0; k < listeMoegl.length; k = k + 1) {
          sum += this.fibs[listeMoegl[k]];
        }
        text += "nr" + i + ": " + j + ": >" + listeMoegl + "< " + sum + "<br>";
      }
    }
  };

  formatNumber = (num: any) => {
    if (num < 10) {
      return "0" + num;
    } else {
      return num;
    }
  }

  displayCurrentTime = (d: number) => {
    let date = getDate(d)
    let tempHour = date.getHours()
    let hours: number = tempHour > 12 ? tempHour - 12 : tempHour
    let minutes: number = getRoundedMin(date)
    let am_pm = tempHour >= 12 ? "PM" : "AM"

    let time: string = ''
    time += (hours < 10 ? `0${hours}` : hours) + ':'
    time += (minutes < 10 ? `0${minutes}` : minutes)
    time += ` ${am_pm}`

    this.datetext = time
  };


  next() {
    let tempDate = getDate(this.currentDT)
    this.currentDT = + new Date(tempDate.getTime() + 5 * 60000)
    localStorage.setItem("currentDT", this.currentDT + '')
    this.myClock(this.currentDT)
  }

  back() {
    let tempDate = getDate(this.currentDT)
    this.currentDT = + new Date(tempDate.getTime() - 5 * 60000);
    localStorage.setItem("currentDT", this.currentDT + '');
    this.myClock(this.currentDT);
  }

}

const getDate = (num: number) => {
  return new Date(num)
}

const getRoundedMin = (date: any) => {
  let min = date.getMinutes()
  return Math.round(min / 5) * 5;
}
