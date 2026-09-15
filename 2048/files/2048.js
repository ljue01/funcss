(function($) {
	
	/**
	 * 阻止页面上下拉滑动*
	**/
	document.body.addEventListener('touchmove', function (e) {
	e.preventDefault(); //阻止下拉滑动的效果
	}, {passive: false}); //passive 参数不能省略，用来兼容ios和android
	
	/**
	* 关闭&重新开始
	**/
	$('body').delegate('#close','click',function(){
		$(this).parents('#pop').remove();
	});
	$('body').delegate('#start','click',function(){
		$(this).parents('#pop').remove();
	});
	
	
	/**
	*声音开关*
	**/
	$('.volume-btn').click(function(){
		if( $(this).hasClass('close') ){
			$(this).addClass('open').removeClass('close');
			closePlay();
		}else{
			$(this).addClass('close').removeClass('open');
			startPlay();
		}
	})
	//播放
	function startPlay() {
	    var myAudio = document.getElementById('my-audio');
	    myAudio.play();
	}
	//暂停
	function closePlay() {
	    var myAudio = document.getElementById('my-audio');
	    myAudio.pause();
	}
	
	/* 开始摸鱼吧 */
	var defaults = {
		delay: 180 // 模块移动速度
	};

	$.fn.init2048 = function(_options) {
		var _this = this,
			options = $.extend(defaults, _options),

			dir = {
				up: 'up',
				right: 'right',
				down: 'down',
				left: 'left'
			},

			// 相关对象
			holder = {}, 
			content = {}, 

			matrix = [], 
			boxes = [], 

			isCheating = 0,
			isGameOver = false;

		resetGame();
		bind();

		/**
		 * 重新开始
		 */
		function resetGame() {
			// 重置
			boxes = [];
			matrix = [];
			isCheating = 0;
			isGameOver = false;
			// 创建DOM
			holder = $('<div>').addClass('holder2048');
			content = $('<div>').addClass('container').appendTo(holder);
			for (var i = 0; i < 4; i++) {
				for (var j = 0; j < 4; j++) {
					
					matrix[i * 4 + j] = {
						top: i * 70,
						left: j * 70,
						taken: false,
						combined: false,
						value: 0
					};
					
					$('<div>').addClass('mask').css({
						left: j * 70 + "px",
						top: i * 70 + "px"
					}).appendTo(content);
				}
			}
			// 创建第一个模块
			createBox();
			// 插入大界面中
			_this.html(holder);
		}


		/**
		 * 开始
		 */
		function createBox(value) {
			// check 是否还产生新模块
			var emptyMatrix = 0;
			for (var i = 0; i < matrix.length; i++) {
				if (!matrix[i].taken) {
					emptyMatrix++;
				}
			}
			if (emptyMatrix === 0) {
				return;
			}

			// 随机产生新模块&index
			var random = Math.floor(Math.random() * emptyMatrix + 1);
			var chosenIndex = 0;
			for (var j = 0; chosenIndex < matrix.length; chosenIndex++) {
				while (matrix[chosenIndex].taken) {
					chosenIndex++;
				}
				if (++j === random) {
					matrix[chosenIndex].taken = true;
					break;
				}
				
			}
			// 创建
			value = value ? value : (Math.floor(Math.random() * 4 + 1) === 4 ? 4 : 2);
			// console.log(value);
			// value = 1024;
			var newBox = $('<div>').addClass('box').attr({
				position: chosenIndex,
				value: value
			}).css({
				marginTop: matrix[chosenIndex].top + 2,
				marginLeft: matrix[chosenIndex].left + 2,
				opacity: 0
			}).text(value).appendTo(content).animate({
				opacity: 1,
			}, options.delay * 2);
			// 推动合并
			boxes.push(newBox);
		}

		/**
		 * 模块合并
		 */
		function combineBox(source, target, value) {
			var _value = parseInt(value) * 2;
			boxes[target].attr('value', _value).html(_value).css({
				zIndex: 99
			}).animate({
				width: '+=20',
				height: '+=20',
				marginTop: '-=10',
				marginLeft: '-=10'
			}, options.delay / 2, function() {
				$(this).animate({
					width: '-=20',
					height: '-=20',
					marginTop: '+=10',
					marginLeft: '+=10'
				}, options.delay / 2, function() {
					$(this).css({
						zIndex: 1
					})
				})
			});
			boxes[source].remove();
			boxes.splice(source, 1);
			
			if (_value === 2048) {
					isGameOver = true;
					// 2048win 弹窗
					var pop = "<div id='pop' style='width:100%;height:100vh;position:fixed;top:0;left:0;background-color:rgba(0,0,0,.4);z-index:999;'>"+
									"<div style='width:250px;height:201px;position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);border-radius: 8px;background-image: linear-gradient(to right, #92fe9d 0%, #00c9ff 100%);'>"+
									"<div id='close' style='width:24px;height:24px;cursor:pointer;position:absolute;top:10px;right:10px;'><svg width='24' height='24' viewBox='0 0 48 48' fill='none' xmlns='http://www.w3.org/2000/svg'><path d='M24 44C35.0457 44 44 35.0457 44 24C44 12.9543 35.0457 4 24 4C12.9543 4 4 12.9543 4 24C4 35.0457 12.9543 44 24 44Z' fill='none' stroke='#ffffff' stroke-width='4' stroke-linejoin='round'/><path d='M29.6567 18.3432L18.343 29.6569' stroke='#ffffff' stroke-width='4' stroke-linecap='round' stroke-linejoin='round'/><path d='M18.3433 18.3432L29.657 29.6569' stroke='#ffffff' stroke-width='4' stroke-linecap='round' stroke-linejoin='round'/></svg></div>"+
										"<div style='width:100%;margin-top:30px;text-align:center;color:#ffffff;text-shadow:0 5px 12px rgba(0,0,0,.3);font-size:36px;font-weight:bold;'>胜 利</div>"+
										"<div id='start' onclick='javascript:location.reload();' style='width:160px;height:44px;line-height:44px;margin:35px auto;background-color:#00B837;color:#ffffff;font-size:20px;font-weight:bold;box-shadow: 0 5px 14px rgba(0,184,55,.4);text-align:center;border-radius: 8px;'>再玩一次</div>"+
									"</div>"+
								"</div>";
					$('body').append(pop);
			}
		}

		/**
		 * 游戏状态是否结束
		 */
		function gameOver() {
			if (boxes.length != 16) {
				return false;
			}
			var i, a, b;
			for (i = 0; i < 16; i++) {
				for (a = 0; a < 16; a++) {
					if (boxes[a].attr('position') == i)
						break;
				}
				if (i % 4 != 3) {
					for (b = 0; b < 16; b++) {
						if (boxes[b].attr('position') == i + 1)
							break;
					}
					if (boxes[a].attr('value') == boxes[b].attr('value'))
						return false;
				}
				if (i < 12) {
					for (b = 0; b < 16; b++) {
						if (boxes[b].attr('position') == i + 4)
							break;
					}
					if (boxes[a].attr('value') == boxes[b].attr('value'))
						return false;
				}
			}
			return true;
		}
		
		
		/**
		 * 开始游戏
		 */
		function gameRun(dir) {
			if (isGameOver) {
				return;
			}
			if (run(dir)) {
				createBox();
			}
			if (gameOver()) {
				isGameOver = true;
				// 游戏结束弹窗
				var pop = "<div id='pop' style='width:100%;height:100vh;position:fixed;top:0;left:0;background-color:rgba(0,0,0,.4);z-index:999;'>"+
								"<div style='width:250px;height:201px;position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);border-radius: 8px;background-image: linear-gradient(to top, #a7a6cb 0%, #8989ba 52%, #8989ba 100%);'>"+
								"<div id='close' style='width:24px;height:24px;cursor:pointer;position:absolute;top:10px;right:10px;'><svg width='24' height='24' viewBox='0 0 48 48' fill='none' xmlns='http://www.w3.org/2000/svg'><path d='M24 44C35.0457 44 44 35.0457 44 24C44 12.9543 35.0457 4 24 4C12.9543 4 4 12.9543 4 24C4 35.0457 12.9543 44 24 44Z' fill='none' stroke='#ffffff' stroke-width='4' stroke-linejoin='round'/><path d='M29.6567 18.3432L18.343 29.6569' stroke='#ffffff' stroke-width='4' stroke-linecap='round' stroke-linejoin='round'/><path d='M18.3433 18.3432L29.657 29.6569' stroke='#ffffff' stroke-width='4' stroke-linecap='round' stroke-linejoin='round'/></svg></div>"+
									"<div style='width:100%;margin-top:30px;text-align:center;color:#ffffff;text-shadow:0 5px 12px rgba(0,0,0,.3);font-size:36px;font-weight:bold;'>失 败</div>"+
									"<div id='start' onclick='javascript:location.reload();' style='width:160px;height:44px;line-height:44px;margin:35px auto;background-color:#FC9B43;color:#ffffff;font-size:20px;font-weight:bold;box-shadow: 0 5px 14px rgba(252,155,67,0.4);text-align:center;border-radius: 8px;'>重新开始</div>"+
								"</div>"+
							"</div>";
				$('body').append(pop);
			}
		}

		/**
		 * 绑定事件
		 */
		function bind() {
			$(window).keydown(function(event) {
				if (!isGameOver) {
					if (event.which == 37) {
						event.preventDefault();
						gameRun(dir.left);
					} else if (event.which == 38) {
						event.preventDefault();
						gameRun(dir.up);
					} else if (event.which == 39) {
						event.preventDefault();
						gameRun(dir.right);
					} else if (event.which == 40) {
						event.preventDefault();
						gameRun(dir.down);
					}
				}
			});
			var touchStartClientX, touchStartClientY;
			document.addEventListener("touchstart", function(event) {
				if (event.touches.length > 1)
					return;
				touchStartClientX = event.touches[0].clientX;
				touchStartClientY = event.touches[0].clientY;
			});
			document.addEventListener("touchmove", function(event) {
				event.preventDefault();
			});
			document.addEventListener("touchend", function(event) {
				if (event.touches.length > 0)
					return;
				var dx = event.changedTouches[0].clientX - touchStartClientX;
				var absDx = Math.abs(dx);
				var dy = event.changedTouches[0].clientY - touchStartClientY;
				var absDy = Math.abs(dy);
				if (Math.max(absDx, absDy) > 10) {
					if (absDx > absDy) {
						if (dx > 0) {
							gameRun(dir.right);
						} else {
							gameRun(dir.left);
						}
					} else {
						if (dy > 0) {
							gameRun(dir.down);
						} else {
							gameRun(dir.up);
						}
					}
				}
			});
		}

		/***/
		function run(dir) {
			var isMoved = false; // check 是否移动
			var i, j, k, empty, _empty, position, value1, value2, temp; //Junks
			// 移动前重置
			for (i = 0; i < 16; i++) {
				matrix[i].combined = false;
			}
			if (dir == "left") {
				isCheating = -1;
				for (i = 0; i < 4; i++) {
					empty = i * 4;
					_empty = empty;
					for (j = 0; j < 4; j++) {
						position = i * 4 + j;
						if (!matrix[position].taken) {
							continue;
						}
						if (matrix[position].taken && position === empty) {
							empty++;
							if (empty - 2 >= _empty) {
								for (k = 0; k < boxes.length; k++) {
									if (boxes[k].attr("position") == position) {
										break;
									}
								}
								value1 = boxes[k].attr('value');
								for (temp = 0; temp < boxes.length; temp++) {
									if (boxes[temp].attr("position") == empty - 2) {
										break;
									}
								}
								value2 = boxes[temp].attr('value');
								if (value1 == value2 && !matrix[empty - 2].combined) {
									combineBox(k, temp, value1);
									matrix[empty - 1].taken = false;
									matrix[empty - 2].combined = true;
									empty--;
									isMoved = true;
								}
							}
						} else {
							for (k = 0; k < boxes.length; k++) {
								if (boxes[k].attr("position") == position) {
									break;
								}
							}
							boxes[k].animate({
								marginLeft: matrix[empty].left + 2,
								marginTop: matrix[empty].top + 2
							}, options.delay);
							boxes[k].attr('position', empty);
							matrix[empty].taken = true;
							matrix[position].taken = false;
							empty++;
							isMoved = true;
							if (empty - 2 >= _empty) {
								value1 = boxes[k].attr('value');
								for (temp = 0; temp < boxes.length; temp++) {
									if (boxes[temp].attr("position") == empty - 2) {
										break;
									}
								}
								value2 = boxes[temp].attr('value');
								if (value1 == value2 && !matrix[empty - 2].combined) {
									combineBox(k, temp, value1);
									matrix[empty - 1].taken = false;
									matrix[empty - 2].combined = true;
									empty--;
								}
							}
						}
					}
				}
			} else if (dir == "right") {
				isCheating = -1;
				for (i = 3; i > -1; i--) {
					empty = i * 4 + 3;
					_empty = empty;
					for (j = 3; j > -1; j--) {
						position = i * 4 + j;
						if (!matrix[position].taken) {
							continue;
						}
						if (matrix[position].taken && position === empty) {
							empty--;
							if (empty + 2 <= _empty) {
								for (k = 0; k < boxes.length; k++) {
									if (boxes[k].attr("position") == position) {
										break;
									}
								}
								value1 = boxes[k].attr('value');
								for (temp = 0; temp < boxes.length; temp++) {
									if (boxes[temp].attr("position") == empty + 2) {
										break;
									}
								}
								value2 = boxes[temp].attr('value');
								if (value1 == value2 && !matrix[empty + 2].combined) {
									combineBox(k, temp, value1);
									matrix[empty + 1].taken = false;
									matrix[empty + 2].combined = true;
									empty++;
									isMoved = true;
								}
							}
						} else {
							for (k = 0; k < boxes.length; k++) {
								if (boxes[k].attr("position") == position) {
									break;
								}
							}
							boxes[k].animate({
								marginLeft: matrix[empty].left + 2,
								marginTop: matrix[empty].top + 2
							}, options.delay);
							boxes[k].attr('position', empty);
							matrix[empty].taken = true;
							matrix[position].taken = false;
							empty--;
							isMoved = true;
							if (empty + 2 <= _empty) {
								value1 = boxes[k].attr('value');
								for (temp = 0; temp < boxes.length; temp++) {
									if (boxes[temp].attr("position") == empty + 2) {
										break;
									}
								}
								value2 = boxes[temp].attr('value');
								if (value1 == value2 && !matrix[empty + 2].combined) {
									combineBox(k, temp, value1);
									matrix[empty + 1].taken = false;
									matrix[empty + 2].combined = true;
									empty++;
								}
							}
						}
					}
				}
			} else if (dir == "up") {
				isCheating = -1;
				for (i = 0; i < 4; i++) {
					empty = i;
					_empty = empty;
					for (j = 0; j < 4; j++) {
						position = j * 4 + i;
						if (!matrix[position].taken) {
							continue;
						}
						if (matrix[position].taken && position === empty) {
							empty += 4;
							if (empty - 8 >= _empty) {
								for (k = 0; k < boxes.length; k++) {
									if (boxes[k].attr("position") == position) {
										break;
									}
								}
								value1 = boxes[k].attr('value');
								for (temp = 0; temp < boxes.length; temp++) {
									if (boxes[temp].attr("position") == empty - 8) {
										break;
									}
								}
								value2 = boxes[temp].attr('value');
								if (value1 == value2 && !matrix[empty - 8].combined) {
									combineBox(k, temp, value1);
									matrix[empty - 4].taken = false;
									matrix[empty - 8].combined = true;
									empty -= 4;
									isMoved = true;
								}
							}
						} else {
							for (k = 0; k < boxes.length; k++) {
								if (boxes[k].attr("position") == position) {
									break;
								}
							}
							boxes[k].animate({
								marginLeft: matrix[empty].left + 2,
								marginTop: matrix[empty].top + 2
							}, options.delay);
							boxes[k].attr('position', empty);
							matrix[empty].taken = true;
							matrix[position].taken = false;
							empty += 4;
							isMoved = true;
							if (empty - 8 >= _empty) {
								value1 = boxes[k].attr('value');
								for (temp = 0; temp < boxes.length; temp++) {
									if (boxes[temp].attr("position") == empty - 8) {
										break;
									}
								}
								value2 = boxes[temp].attr('value');
								if (value1 == value2 && !matrix[empty - 8].combined) {
									combineBox(k, temp, value1);
									matrix[empty - 4].taken = false;
									matrix[empty - 8].combined = true;
									empty -= 4;
								}
							}
						}
					}
				}
			} else if (dir == "down") {
				if (isCheating != -1) {
					isCheating++;
				}
				for (i = 0; i < 4; i++) {
					empty = i + 12;
					_empty = empty;
					for (j = 3; j > -1; j--) {
						position = j * 4 + i;
						if (!matrix[position].taken) {
							continue;
						}
						if (matrix[position].taken && position === empty) {
							empty -= 4;
							if (empty + 8 <= _empty) {
								for (k = 0; k < boxes.length; k++) {
									if (boxes[k].attr("position") == position) {
										break;
									}
								}
								value1 = boxes[k].attr('value');
								for (temp = 0; temp < boxes.length; temp++) {
									if (boxes[temp].attr("position") == empty + 8) {
										break;
									}
								}
								value2 = boxes[temp].attr('value');
								if (value1 == value2 && !matrix[empty + 8].combined) {
									combineBox(k, temp, value1);
									matrix[empty + 4].taken = false;
									matrix[empty + 8].combined = true;
									empty += 4;
									isMoved = true;
								}
							}
						} else {
							for (k = 0; k < boxes.length; k++) {
								if (boxes[k].attr("position") == position) {
									break;
								}
							}
							boxes[k].animate({
								marginLeft: matrix[empty].left + 2,
								marginTop: matrix[empty].top + 2
							}, options.delay);
							boxes[k].attr('position', empty);
							matrix[empty].taken = true;
							matrix[position].taken = false;
							empty -= 4;
							isMoved = true;
							if (empty + 8 <= _empty) {
								value1 = boxes[k].attr('value');
								for (temp = 0; temp < boxes.length; temp++) {
									if (boxes[temp].attr("position") == empty + 8) {
										break;
									}
								}
								value2 = boxes[temp].attr('value');
								if (value1 == value2 && !matrix[empty + 8].combined) {
									combineBox(k, temp, value1);
									matrix[empty + 4].taken = false;
									matrix[empty + 8].combined = true;
									empty += 4;
								}
							}
						}
					}
				}
			}
			return isMoved;
		}
	}

})(jQuery);