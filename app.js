// by Just. Liu
// v0.0.1
// 2020.12.01 p.m. 9:44

const app = Vue.createApp({	
  data() {
    return {
      buttons: [],
			inputs: []
    }
  },
  mounted() {
		axios.all([
			axios.get('data/buttons.json'),
			axios.get('data/inputs.json')
		]).then(axios.spread((post1, post2) => {
			this.buttons = post1.data;
			this.inputs = post2.data;
		})).catch(error => {
			console.log(error);
		});
	},
	computed: {
		filteredHtml() {
			return function(value) {
				return value.replace(/<style>/gi, "").replace(/<\/style>/gi, "");
			};
		},
	},
	components: {
		"my-footer": {
			template: "#my-footer"
		}
	}
})

app.mount('#app');

