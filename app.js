// by Just. Liu
// v0.0.1

const app = Vue.createApp({	
  data() {
    return {
			selectedType: '',
			show: false,
			about: false,
			like: false,
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
				return value.replace(/<style>/g, '<style>'+'.cs'+cId+' ')
				.replace(/}/g, '}.cs'+cId+' ')
				.replace(/}[^}]*<\/style>/g, '}</style>')
				.replace(/}.cs[^}]*@/g, '}@')
				.replace(/}.cs[^}]*\s}/g, '}}')
				.replace(/}.cs\d+\s(100%|0%|50%|75%|to|from)/g, '}$1');
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
		// 显示about
		showAbout(){
			this.about = true;
		},
		// 隐藏about
		hideAbout(){
			this.about = false;
		},
		// 显示like
		showLike(){
			this.like = true;
		},
		// 隐藏like
		hideLike(){
			this.like = false;
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

app.component('footers', {
  template: `
	<footer>
		<section>
			<span>funcss ©️ 2020</span>
			<a class="text-link" target="_blank" href="https://beian.miit.gov.cn/">冀ICP备19017590号-1</a>
		</section>
		<section>
			<a class="text-link" href="javascript:;"  @click="showLike">喜欢</a>
			<a class="text-link" href="javascript:;"  @click="showAbout">关于</a>
			<a class="text-link" href="https://whtool.liujueyi.cn/" target="_blank">WHTOOL</a>
			<a class="text-link" href="https://gitee.com/ctrl-S/just-web-dev" target="_blank">Gitee</a>
		</section>
	</footer>
	`
})

app.mount('#app')
