// by Just. Liu
// v0.0.1

// 谷歌广告启动脚本
window['addAds'] = function(){
		window.onload=function(){
				let childList = document.getElementsByClassName('gads');
				for (let i = 0; i < childList.length; i++) {
						let insNode = childList[i].firstChild;
						insNode.style.maxWidth = childList[i].clientWidth||childList[i].offsetWidth;
						(adsbygoogle = window.adsbygoogle || []).push({});
				}
		}
};

const app = Vue.createApp({	
  data() {
    return {
			selectedType: '',
			show: false,
			about: false,
			sponsor: false,
			like: false,
			htmlTip: false,
			cssTip: false,
			pageLoad: true,
      items: []
    }
  },
  mounted() {
		axios.get('data/data.json').then(response => {
			this.items = response.data;
		}).catch(error => {
			console.log(error);
		});
		setTimeout(() => {
			this.pageLoad = false;
		}, 5000);
		// 启动谷歌广告
		window.addAds();
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
		// filteredItems() {
		// 	return this.selectedType === ''
		// 		? this.items
		// 		: this.items.filter(item => item.type === parseInt(this.selectedType))
		// },
		filteredItems() {
			let filtered = this.selectedType === ''
				? this.items
				: this.items.filter(item => item.type === parseInt(this.selectedType));

			// 反序排列
			return filtered.slice().reverse();
		},
		LocationStyle() {
			return function(value,cId){
				return value.replace(/<style>/g, '<style>'+'.cs'+cId+' ')
				.replace(/}/g, '}.cs'+cId+' ')
				.replace(/}[^}]*<\/style>/g, '}</style>')
				.replace(/}.cs[^}]*@/g, '}@')
				.replace(/}.cs[^}]*\s}/g, '}}')
				.replace(/}.cs\d+\s(0%|5%|10%|15%|20%|25%|29%|30%|31%|35%|40%|45%|50%|55%|60%|65%|69%|70%|71%|75%|80%|85%|90%|95%|100%|to|from)/g, '}$1');
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
		// 显示sponsor
		showSponsor(){
			this.sponsor = true;
		},
		// 隐藏sponsor
		hideSponsor(){
			this.sponsor = false;
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
		// 回到顶部
		// top(){
		// 	window.scrollTo({
		// 	        top:0,
		// 	        behavior:"smooth"
		// 	    })
		// }
  }
})

app.mount('#app')
