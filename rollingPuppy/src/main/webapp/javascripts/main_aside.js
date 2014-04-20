var initPage = function() {
	var panel = new Panel(document.querySelector('div#panel'));
	panel.addEvents(panel.elPanel);
}

var Panel = function(elPanel) {
	this.elPanel = elPanel;
	var count = {
			animationEnds: 0
	}
	
	this.addEvents = function(elPanel) {
		var elContainer = elPanel.parentNode.parentNode;
		var elButtons = elPanel.querySelectorAll('a');
		
		for (var idx = 0; idx < elButtons.length; idx++) {
			elButtons[idx].addEventListener(
					'click',
					function(event) {
						foldPanel(event, elContainer);
					},
					false
			);
		}
		
		elContainer.addEventListener(
				'animationEnd',
				function(event) {
					noPanel(event, elContainer);
				}
		);
		
		elContainer.addEventListener(
				'webkitAnimationEnd',
				function(event) {
					noPanel(event, elContainer, count);
				}
		);
	}
	
	var foldPanel = function(event, elContainer) {
		event.preventDefault();

		var strButtonClassName = event.target.className;

		var boolFold = false;
		if (strButtonClassName === 'panel_button_fold') {
			boolFold = true;
		}
		
		if (boolFold) {
			elContainer.className = 'fold_panel';
		} else {
			elContainer.className = 'unfold_panel';
		}
	}
	
	var noPanel = function(event, elContainer, count) {
		count.animationEnds ++;
		if (count.animationEnds % 2 == 0) {
			return ;
		}
		
		var strElContainerClassName = elContainer.className;
		
		var boolFold = false;
		if (strElContainerClassName === 'fold_panel') {
			boolFold = true;
		}
		
		if (boolFold) {
			elContainer.className = 'no_panel';
		}
		else {
			elContainer.className = '';
		}
	}
	
}

window.onload = initPage;