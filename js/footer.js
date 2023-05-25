Vue.component('footers', {
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