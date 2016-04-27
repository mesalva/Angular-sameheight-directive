myapp.directive('sameheight', function() {
	var sameheight = {};
	var timeout;

	angular.element(window).resize(updateAllHeightsWhenReady);

	return {
		restrict: 'A',
		link: function () {
			updateAllHeightsWhenReady();
		}
	};

	function updateAllHeightsWhenReady(){
		clearTimeout(timeout);
		timeout = setTimeout(updateAllHeights, 50);
	}

	function updateAllHeights(){
		removeElementHeights();
		scanElementHeights();
		setElementHeights();
	}

	function scanElementHeights(){
		angular.element('[sameheight]').each(function(){
			var name = angular.element(this).attr('sameheight');
			var height = angular.element(this).height();

			if(isNotTheMain(this) && isFirstOrBiggest(name, height) === false){
				return;
			}

			initializeObjectIfNeeded(name);

			setObjectMain(this, name);
			setObjectHeight(height, name);
			setObjectMinResolution(this, name);
		});
	}

	function initializeObjectIfNeeded(name){
		if(sameheight[name] === undefined){
			sameheight[name] = {};
		}
	}

	function setObjectMain(element, name){
		sameheight[name].main = isTheMain(element);
	}

	function setObjectHeight(height, name){
		sameheight[name].height = height;
	}

	function setObjectMinResolution(element, name){
		var resolution = angular.element(element).data('sameheight-resolution');
		if(resolution === undefined){
			return;
		}

		if(mayUpdateResolution(resolution, name)){
			sameheight[name].resolution = resolution;
		}
	}

	function mayUpdateResolution(resolution, name){
		return hasNoSettedResolution(name) || settedResolutionIsBiggestThanThisResolutionFor(resolution, name);
	}

	function settedResolutionIsBiggestThanThisResolutionFor(resolution, name){
		var setted_resolution = sameheight[name].resolution;
		return parseResolutionToWidth(setted_resolution) > parseResolutionToWidth(resolution);
	}

	function parseResolutionToWidth(resolution){
		var resolution_list = ['xs', 'sm', 'md', 'lg'];
		var width_list = [0, 768, 992, 1200];

		var resolution_index = resolution_list.indexOf(resolution);
		return width_list[resolution_index];
	}

	function hasNoSettedResolution(name){
		return sameheight[name].resolution === undefined;
	}

	function removeElementHeights(){
		angular.element('[sameheight]').css('height', 'auto');
	}

	function setElementHeights(){
		angular.forEach(sameheight, function(value, name){
			if(mayUpdateResolutionForThisResolution(name)){
				angular.element('[sameheight='+name+']').height(sameheight[name].height);
			}
		})
	}

	function mayUpdateResolutionForThisResolution(name){
		var setted_resolution = sameheight[name].resolution;
		if(setted_resolution === undefined){
			return true;
		}

		return thisResolutionBiggestThan(setted_resolution);
	}

	function thisResolutionBiggestThan(setted_resolution){
		var setted_width = parseResolutionToWidth(setted_resolution);
		return window.matchMedia("(min-width: " + setted_width + "px)").matches;
	}

	function isFirstOrBiggest(name, height){
		if(sameheight[name] === undefined){
			return true;
		}
		return sameheight[name].main === false && sameheight[name].value <= height;
	}

	function isTheMain(element){
		return angular.element(element).is('[data-sameheight-main]') === false;
	}

	function isNotTheMain(element){
		return isTheMain(element) === false;
	}
});