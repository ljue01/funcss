// by Just. Liu
// v0.0.1
// 2020.12.01 p.m. 9:44

const app = Vue.createApp({	
  data() {
    return {
			show: false,
      items: []
    }
  },
  mounted() {
		axios.get('data/data.json').then(response => {
			this.items = response.data;
		}).catch(error => {
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
  methods: {
		// 显示弹层
		showPopup(item){
			this.popupItem = item;
			this.show = true;
		},
		// 隐藏弹层
		hidePopup(){
			this.popupItem = null;
			this.show = false;
		}
  }
})
app.mount('#app')
