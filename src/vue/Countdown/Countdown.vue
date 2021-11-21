<template>
  <div class="counter-wrapper">
    <div class="counter-item days">
        <span class="counter-item-nr">{{days}}</span>
        <span class="counter-item-unit text-center">days</span>
    </div>
    <div class="counter-item hours">
        <span class="counter-item-nr">{{hours}}</span>
        <span class="counter-item-unit text-center">hours</span>
    </div>
    <div class="counter-item minutes">
        <span class="counter-item-nr">{{minutes}}</span>
        <span class="counter-item-unit text-center">min</span>
    </div>
    <div class="counter-item seconds">
        <span class="counter-item-nr">{{seconds}}</span>
        <span class="counter-item-unit text-center">sec</span>
    </div>
  </div>
</template>

<script>
export default {
    data() {
      return {
        now: new Date(),
        endDate: new Date('2021/11/26'),
        days: '',
        hours: '',
        minutes: '',
        seconds: '',
      };
    },
    mounted(){
      //functie updateTime voor de eerste keer uitvoeren
      this.updateTime();
    },
    methods: {
        // Functie die 'updateTime' na 1 seconde gaat uitvoeren
        updateTimeLoop: function() {
            setTimeout(() => {
              this.updateTime();
            }, 1000);
        },
        updateTime: function() {
          //vergelijking tussen nu en einddatum en returnt timestamp in seconden
          let diff = Math.abs(this.endDate.getTime() - this.now.getTime()) / 1000;

          this.days = Math.floor(diff / 86400);

          //kijken als getal kleiner of gelijk is aan 9, als dat zo is 0 voorzetten zodat er altijd 2 cijfers zijn
          if(this.days <= 9){
            this.days = '0' + this.days
          }

          this.hours = Math.floor(diff / 3600) % 24;

          if(this.hours <= 9){
            this.hours = '0' + this.hours
          }

          this.minutes = Math.floor(diff / 60) % 60;

          if(this.minutes <= 9){
            this.minutes = '0' + this.minutes
          }

          this.seconds = Math.floor(diff % 60);

          if(this.seconds <= 9){
            this.seconds = '0' + this.seconds
          }


          // seconde toevoegen aan timestamp en dan converteren naar full text string format
          var updatedTime = new Date();
          updatedTime.setSeconds(updatedTime.getSeconds() + 1);
          this.now = new Date(updatedTime);

          /// terug naar updateTimeLoop functie die 'updateTime' na 1 seconde terug gaat uitvoeren
          this.updateTimeLoop();
        }
    }
};
</script>

<style lang="scss" scoped>
@import './Countdown.scss';
</style>
