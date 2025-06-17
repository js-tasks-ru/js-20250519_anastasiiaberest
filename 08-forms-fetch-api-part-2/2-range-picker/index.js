export default class RangePicker {
  element;
  monthList = ['январь', 'февраль', 'март', 'апрель', 'май', 'июнь', 'июль', 'август', 'сентябрь', 'октябрь', 'ноябрь', 'декабрь'];
  selectedMonth;
  currentYear;
  constructor({ from = null, to = null }) {
    this.from = from;
    this.to = to;

    this.selectedMonth = this.from.getMonth();
    this.currentYear = this.from.getFullYear();

    this.element = this.createElement();
    this.createCalendar();
    this.addEventListeners();
  }

  formatDate(date) {
    const newDate = new Date(date).toLocaleDateString('ru');
    return newDate;
  }

  getMonth(month) {
    return this.monthList[month];
  }

  createSelectorTemplate() {
    return `
				<div class="rangepicker__selector-arrow"></div>
				<div class="rangepicker__selector-control-left"></div>
				<div class="rangepicker__selector-control-right"></div>
				<div class="rangepicker__calendar">
					<div class="rangepicker__month-indicator">
						<time datetime="November">${this.getMonth(this.selectedMonth)}</time>
					</div>
					<div class="rangepicker__day-of-week">
						<div>Пн</div><div>Вт</div><div>Ср</div><div>Чт</div><div>Пт</div><div>Сб</div><div>Вс</div>
					</div>
					<div class="rangepicker__date-grid"></div>
				</div>
				<div class="rangepicker__calendar">
					<div class="rangepicker__month-indicator">
						<time datetime="November">${this.getMonth(this.selectedMonth + 1)}</time>
					</div>
					<div class="rangepicker__day-of-week">
						<div>Пн</div><div>Вт</div><div>Ср</div><div>Чт</div><div>Пт</div><div>Сб</div><div>Вс</div>
					</div>
					<div class="rangepicker__date-grid"></div>
				</div>
		`;
  }

  createTemplate() {
    return `
			<div class="rangepicker">
				<div class="rangepicker__input" data-element="input">
					<span data-element="from">${this.formatDate(this.from)}</span> -
					<span data-element="to">${this.formatDate(this.to)}</span>
				</div>
				<div class="rangepicker__selector" data-element="selector"></div>
			</div>
		`;
  }

  createElement() {
    const element = document.createElement('div');
    element.innerHTML = this.createTemplate();
    return element.firstElementChild;
  }

  createCalendarTemplate(wrapper, month, year) {
    wrapper.innerHTML = '';
    const totalDays = new Date(year, month + 1, 0).getDate();
    let firstDayOfWeek = new Date(year, month, 1).getDay();
    firstDayOfWeek = firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1;

    for (let day = 1; day <= totalDays; day++) {
      const date = new Date(year, month, day);
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'rangepicker__cell';
      button.textContent = day;
      button.dataset.value = date.toISOString();

      if (day === 1) {
        button.style.setProperty('--start-from', firstDayOfWeek + 1);
      }

      wrapper.appendChild(button);
    }
  }

  createCalendar() {
    const calendars = this.element.querySelectorAll('.rangepicker__date-grid');

    calendars.forEach((el, index) => {
      let month = this.selectedMonth + index;
      let year = this.currentYear;

      if (month > 11) {
        month = 0;
        year++;
      }

      this.createCalendarTemplate(el, month, year);
    });

    this.updateCells();
  }

  addEventListeners() {
    const dateInput = this.element.querySelector('.rangepicker__input');

    dateInput.addEventListener('click', (e) => {
      e.stopPropagation();
      this.showCalendar();
    });

    this.documentClickHandler = (e) => {
      if (this.element && !this.element.contains(e.target)) {
        this.hideCalendar();
      }
    };

    document.addEventListener('click', this.documentClickHandler);
  }

  showCalendar() {
    const selector = this.element.querySelector('[data-element="selector"]');
    if (this.element.classList.contains('rangepicker_open')) {
      this.hideCalendar();
      return;
    }

    selector.innerHTML = this.createSelectorTemplate();
    this.createCalendar();

    this.updateCells();

    this.element.classList.add('rangepicker_open');
    this.addCalendarEventListeners();
  }

  hideCalendar() {
    const selector = this.element.querySelector('[data-element="selector"]');
    if (selector) {
      this.removeCalendarEventListeners();

    }
    this.element.classList.remove('rangepicker_open');
  }

  addCalendarEventListeners() {
    this.arrowPrev = this.element.querySelector('.rangepicker__selector-control-left');
    this.arrowNext = this.element.querySelector('.rangepicker__selector-control-right');
    this.selector = this.element.querySelector('[data-element="selector"]');

    this.arrowPrevClickHandler = (e) => {
      this.prevMonth();
    };
    this.arrowNextClickHandler = (e) => {
      this.nextMonth();
    };
    this.cellClickHandler = (e) => {
      const cell = e.target.closest('.rangepicker__cell');
      if (cell) {
        this.selectCell(cell);
      }
    };

    this.arrowPrev.addEventListener('click', this.arrowPrevClickHandler);
    this.arrowNext.addEventListener('click', this.arrowNextClickHandler);
    this.selector.addEventListener('click', this.cellClickHandler);
  }

  removeCalendarEventListeners() {
    if (this.arrowPrev) {
      this.arrowPrev.removeEventListener('click', this.arrowPrevClickHandler);
    }
    if (this.arrowNext) {
      this.arrowNext.removeEventListener('click', this.arrowNextClickHandler);
    }
    if (this.selector) {
      this.selector.removeEventListener('click', this.cellClickHandler);
    }
  }

  prevMonth() {
    this.selectedMonth -= 1;
    if (this.selectedMonth < 0) {
      this.selectedMonth = 11;
      this.currentYear -= 1;
    }
    this.updateMonthIndicator();
    this.createCalendar();
  }

  nextMonth() {
    this.selectedMonth += 1;
    if (this.selectedMonth > 11) {
      this.selectedMonth = 0;
      this.currentYear += 1;
    }
    this.updateMonthIndicator();
    this.createCalendar();
  }

  updateMonthIndicator() {
    const monthIndicators = this.element.querySelectorAll('.rangepicker__month-indicator time');

    if (monthIndicators.length >= 2) {
      let nextMonth = this.selectedMonth + 1;
      let nextYear = this.currentYear;

      if (nextMonth > 11) {
        nextMonth = 0;
        nextYear += 1;
      }

      monthIndicators[0].textContent = this.getMonth(this.selectedMonth);
      monthIndicators[1].textContent = this.getMonth(nextMonth);
    }
  }

  selectCell(cell) {
    const selectedDate = new Date(cell.dataset.value);
    if (!this.from || (this.from && this.to)) {
      this.from = selectedDate;
      this.to = null;
      this.updateCells();
    } else if (this.from && !this.to) {
      if (selectedDate > this.from) {
        this.to = selectedDate;
      } else {
        this.to = this.from;
        this.from = selectedDate;
      }
      this.updateInput();
      this.updateCells();
      this.dispatchDateSelectEvent();
    }
  }

  updateInput() {
    const fromElement = this.element.querySelector('[data-element="from"]');
    const toElement = this.element.querySelector('[data-element="to"]');

    if (this.from) {
      fromElement.textContent = this.formatDate(this.from);
    }

    if (this.to) {
      toElement.textContent = this.formatDate(this.to);
    } else {
      toElement.textContent = '';
    }
  }

  updateCells() {
    const cells = this.element.querySelectorAll('.rangepicker__cell');

    cells.forEach(cell => {
      cell.classList.remove(
        'rangepicker__selected-from',
        'rangepicker__selected-to',
        'rangepicker__selected-between'
      );

      const cellDate = new Date(cell.dataset.value);

      if (this.from && !this.to) {
        if (cellDate.getTime() === this.from.getTime()) {
          cell.classList.add('rangepicker__selected-from');
        }
      } else if (this.from && this.to) {
        if (cellDate.getTime() === this.from.getTime()) {
          cell.classList.add('rangepicker__selected-from');
        } else if (cellDate.getTime() === this.to.getTime()) {
          cell.classList.add('rangepicker__selected-to');
        } else if (cellDate > this.from && cellDate < this.to) {
          cell.classList.add('rangepicker__selected-between');
        }
      }
    });
  }

  dispatchDateSelectEvent() {
    const event = new CustomEvent('date-select', {
      detail: {
        from: this.from,
        to: this.to
      }
    });
    this.element.dispatchEvent(event);
  }

  remove() {
    this.element = null;
  }

  destroy() {
    document.removeEventListener('click', this.documentClickHandler);
    this.remove();
  }

}
