<template>
  <div class="calendar-container" :class="[isRed ? 'red-theme' : 'blue-theme']" :style="containerStyle">
    <div id="calendar">
      <div id="calendar-header">
        <span class="arrow iky-arrow-left-db" @click="subYear"></span>
        <span class="arrow iky-arrow-left" @click="subMonth"></span>
        <span id="date-box">
          {{trueSelectYear}}年 {{trueSelectMonth}}月
        </span>
        <span class="arrow iky-arrow-right" @click="addMonth"></span>
        <span class="arrow iky-arrow-right-db" @click="addYear"></span>
      </div>
      <div class="week">
        <span v-for="(item, index) in week" :class="{weekend: index === 0 || index === 6}" :key="index">
          {{item}}
        </span>
      </div>
      <div class="days">
        <span v-for="(item, index) in renderData" :class="{ 
          weekend: index % 7 === 0 || index % 7 === 6, 
          unselect: (unselectArr.includes(index))||
          (item<new Date().getDate()&&(selectMonth<=new Date().getMonth()+1)&&(selectYear<=new Date().getFullYear()))||
          (new Date().getHours()>=14&&item==new Date().getDate()&&(selectMonth<=new Date().getMonth()+1)&&(selectYear<=new Date().getFullYear()))||
          (selectYear<new Date().getFullYear()),
          select: (index === firstDayInWeek + trueSelectDay - 1) 
        }" @click.stop="changeSelectDay(index,item)" :key="index">
          {{item}}
        </span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'calendar',
  props: {
    show: {   //是否显示组件
      type: Boolean,
      default: true
    },
    isRed: {  //红蓝两种主题可选
      type: Boolean,
      default: false
    },
    limit: {  //日期可选范围
      type: Object,
      default() {
        return {
          minYear: 1900,
          minMonth: 1,
          minDay: 1,
          maxYear: 2099,
          maxMonth: 3,
          maxDay: 20
        }
      }
    },
    showCalendar: {  //是否显示日历
      type: Boolean,
      default: true
    },
    containerStyle: { //组件容器样式
      type: Object
    }
  },
  data() {
    return {
      isfocus: true,
      changeShowCalendar: this.showCalendar,
      week: ["日", "一", "二", "三", "四", "五", "六"],
      date: new Date(),
      selectYear: new Date().getFullYear(),
      selectMonth: new Date().getMonth() + 1,
      selectDay: new Date().getDate()
    }
  },
  methods: {
    focus() {
      this.isfocus = !this.isfocus;
      this.changeShowCalendar = !this.changeShowCalendar;
    },
    subYear() { 
      if(this.selectYear === new Date().getFullYear()){
        return false;
      }
      this.selectYear > this.limit.minYear + 1 && this.selectYear-- 
    },
    addYear() { this.selectYear < this.limit.maxYear - 1 && this.selectYear++ },
    subMonth() {
      if(this.selectMonth === new Date().getMonth() + 1 && this.selectYear === new Date().getFullYear()){
        return false;
      }
      if (this.selectMonth === 1) {
        this.selectMonth = 12;
        this.selectYear -= 1;
      } else {
        this.selectMonth -= 1
      }
      if (this.selectYear < this.limit.minYear) this.selectYear = this.limit.minYear;
      if (this.selectYear === this.limit.minYear) {
        if (this.selectMonth <= this.limit.minMonth) {
          this.selectMonth = this.limit.minMonth;
        }
      }
    },
    addMonth() {
      if (this.selectMonth === 12) {
        this.selectMonth = 1;
        this.selectYear += 1;
      } else {
        this.selectMonth += 1
      }
      if (this.selectYear > this.limit.maxYear) this.selectYear = this.limit.maxYear;
      if (this.selectYear === this.limit.maxYear) {
        if (this.selectMonth >= this.limit.maxMonth) {
          this.selectMonth = this.limit.maxMonth;
        }
      }
    },
    changeSelectDay(index,item) {
      // if (this.unselectArr.includes(index)) return false;
      if ((this.unselectArr.includes(index))||
          (item<new Date().getDate()&&(this.selectMonth<=new Date().getMonth()+1)&&(this.selectYear<=new Date().getFullYear()))||
          (this.selectYear<new Date().getFullYear())) return false;
      if(item == new Date().getDate() && new Date().getHours() >=14) return false;
      this.selectDay = index - this.firstDayInWeek + 1;
      
    },
  },
  computed: {
    trueSelectYear: function() {
      if (this.selectYear < this.limit.minYear) return this.limit.minYear;
      if (this.selectYear > this.limit.maxYear) return this.limit.maxYear;
      return this.selectYear;
    },
    trueSelectMonth: function() {
      if (this.selectYear === this.limit.minYear && this.selectMonth < this.limit.minMonth) return this.limit.minMonth;
      if (this.selectYear === this.limit.maxYear && this.selectMonth > this.limit.maxMonth) return this.limit.maxMonth;
      return this.selectMonth;
    },
    trueSelectDay: function() {
      if (this.selectYear === this.limit.minYear && this.selectMonth === this.limit.minMonth && this.selectDay < this.limit.minDay) return this.limit.minDay;
      if (this.selectYear === this.limit.maxYear && this.selectMonth === this.limit.maxMonth && this.selectDay > this.limit.maxDay) return this.limit.maxDay;
      if (this.selectDay > this.dayCount) return this.dayCount;
      return this.selectDay;
    },
    selectValue: function() {
      let m = this.trueSelectMonth < 10 ? '0' + this.trueSelectMonth : this.trueSelectMonth
      let d = this.trueSelectDay < 10 ? '0' + this.trueSelectDay : this.trueSelectDay
      return `${this.trueSelectYear}-${m}-${d}`;
    },
    firstDayInWeek: function() {
      return new Date(this.trueSelectYear, this.trueSelectMonth - 1, 1).getDay();
    },
    dayCount: function() {
      return new Date(this.trueSelectYear, this.trueSelectMonth, 0).getDate();
    },
    lastMonthDay: function() {
      let lastNum = this.firstDayInWeek;
      let lastDays = [];
      if (lastNum === 0) return lastDays;
      let i = 0;
      let lastDayNum = new Date(this.trueSelectYear, this.trueSelectMonth - 1, 0).getDate();
      for (; i < lastNum; i++) {
        lastDays.unshift(lastDayNum);
        lastDayNum--;
      }
      return lastDays;
    },
    nextMonthDay: function() {
      let num = 42 - this.firstDayInWeek - this.dayCount;
      let nextDays = [];
      if (num === 0) return nextDays;
      let i = 1;
      for (; i <= num; i++) {
        nextDays.push(i);
      }
      return nextDays;
    },
    renderData: function() {
      let nowDays = [];
      let i = 1;
      for (; i <= this.dayCount; i++) {
        nowDays.push(i);
      }
      return [...this.lastMonthDay, ...nowDays, ...this.nextMonthDay];
    },
    unselectArr: function() {
      let index = 0;
      let arr = [];
      if (this.trueSelectYear === this.limit.minYear && this.trueSelectMonth === this.limit.minMonth) {
        for (; index < this.firstDayInWeek + this.limit.minDay - 1; index++) {
          arr.push(index);
        }
      } else {
        for (; index < this.firstDayInWeek; index++) {
          arr.push(index)
        }
      }
      if (this.trueSelectYear === this.limit.maxYear && this.trueSelectMonth === this.limit.maxMonth) {
        index = this.firstDayInWeek + this.limit.maxDay;
        for (; index < 42; index++) {
          arr.push(index);
        }
      } else {
        index = this.firstDayInWeek + this.dayCount;
        for (; index < 42; index++) {
          arr.push(index);
        }
      }
      return arr;
    }
  },
  watch: {
    selectValue(newVal) {
      this.$emit('getValue', newVal);
    }
  },
  mounted() {
    if(new Date().getHours() >= 14){
      let tt = new Date(new Date().getTime()+24*60*60*1000)
      this.selectYear = tt.getFullYear()
      this.selectMonth = tt.getMonth()+1
      this.selectDay = tt.getDate();
    }
    this.$emit('getValue', this.selectValue);
  }
}
</script>