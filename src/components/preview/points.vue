<template>
  <div id="points">
    <v-flex dense elevation="0" class="pa-0 mt-2">
      <!-- <v-btn
        v-for="(point, p) in data"
        @click="selected = p"
        color="#007bff"
        :style="
          'background-color: ' +
          (selected == p ? '#007bff; color: white;' : 'transparent')
        "
        :key="p"
        tile
        outlined
      >
        {{ point.Value }}
      </v-btn> -->
      <div class="c-btn-group">
        <a
          class="c-btn"
          @click="selected = p"
          :style="
            'background-color: ' +
            (selected == p ? '#007bff; color: white;' : 'transparent')
          "
          v-for="(point, p) in data"
          :key="p"
          >{{ point.Value }}</a
        >
      </div>
    </v-flex>
  </div>
</template>

<script>
export default {
  props: {
    data: Object,
  },
  data() {
    return {
      selected: -1,
    };
  },
};
</script>

<style>
.c-btn {
  width: 58.5px;
  border: solid 1px #007bff;
  display: inline-block;
  text-align: center;
  padding: 0.5rem 1rem;
  font-size: 1.25rem;
  line-height: 1.5;
  border-radius: 0.3rem;
}
.c-btn:hover,
.c-btn:focus {
  cursor: pointer;
  background-color: #007bff;
  /* color: #fff; */
}
.c-btn-group {
  display: inline-flex;
  border: 1px solid #007bff;
  overflow: hidden;
  border-radius: 4px;
}
.c-btn-group > .c-btn {
  border-radius: 0;
  border: none;
  border-right: 1px solid #007bff;
}
.c-btn-group > .c-btn:last-child {
  border-right: none;
}
.c-btn-group--block {
  display: flex;
}
.c-btn-group--block > .c-btn {
  flex-grow: 1;
}
.c-btn-group--vertical-block {
  display: flex;
  flex-direction: column;
}
.c-btn-group--vertical-block > .c-btn {
  flex-grow: 1;
  border: none;
  border-bottom: 1px solid #007bff;
}
.c-btn-group--vertical-block > .c-btn:last-child {
  border-bottom: none;
}
</style>