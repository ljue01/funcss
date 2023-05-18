// by Just. Liu
// v0.0.1
// 2020.12.01 p.m. 9:44

const app = Vue.createApp({	
  data() {
    return {
			selectedType: '',
			show: false,
			htmlTip: false,
			cssTip: false,
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
		LocationStyle() {
			return function(value,cId){
				return value.replace(/<style>/g, '<style>'+'.c'+cId+' ')
				.replace(/}/g, '}.c'+cId+' ')
				.replace(/}[^}]*<\/style>/g, '}</style>')
				.replace(/}.c[^}]*@/g, '}@')
				.replace(/}.c[^}]*\s}/g, '}}')
				.replace(/}.c[^}]*\s(100%|0%|50%|75%|to|from)/g, '}$1');
				
				//}.c2 to{
			}
		}
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
		},
		// 复制html代码
		copyHtml() {
		  const htmlBox = document.querySelector('.html-box');
		  const textToCopy = htmlBox.innerText;
			
		  const tempInput = document.createElement('textarea');
		  tempInput.value = textToCopy;
			
		  document.body.appendChild(tempInput);
		  tempInput.select();
		  document.execCommand('copy');
		  document.body.removeChild(tempInput);
			
		  console.log('复制成功');
			
			this.htmlTip = true;
			setTimeout(() => {
				this.htmlTip = false;
			}, 2000); // 2秒后隐藏提示信息
			
		},
		// 复制css代码
		copyCss() {
		  const htmlBox = document.querySelector('.css-box');
		  const textToCopy = htmlBox.innerText;
			
		  const tempInput = document.createElement('textarea');
		  tempInput.value = textToCopy;
			
		  document.body.appendChild(tempInput);
		  tempInput.select();
		  document.execCommand('copy');
		  document.body.removeChild(tempInput);
			
		  console.log('复制成功');
			
			this.cssTip = true;
			setTimeout(() => {
				this.cssTip = false;
			}, 2000); // 2秒后隐藏提示信息
			
		}
  }
})
app.mount('#app')
