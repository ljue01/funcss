// by Just. Liu
// v0.0.1
// 2020.12.01 p.m. 9:44

const app = Vue.createApp({	
  data() {
    return {
			selectedType: '',
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
		filteredCode() {
			return function(value) {
				return value.replace(/><\//g, '>\n</')
				.replace(/}/g, '}\n')
				.replace(/></g, '>\n<')
				.replace(/\{/g, '{\n  ')
				.replace(/;/g, ';\n  ')
				.replace(/<style>/gi, '')
				.replace(/<\/style>/gi, '')
				.replace(/'/g, '"')
				.replace(/  }/g, '}');
			};
		},
		filteredItems() {
			return this.selectedType === ''
				? this.items
				: this.items.filter(item => item.type === parseInt(this.selectedType))
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
