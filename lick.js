(function (undefined) {
	// Function that kicks everything off.
	var startLicking = function() {
		// Places to monitor and where to find the word "like".
		var commonPlaces = [
			// X and Y like this
			".UFILikeSentenceText span span",
			// Like links
			".fbTimelineFeedbackActions a.UFILikeLink",
			"form.commentable_item a.UFILikeLink",
			// In news feed: X liked this
			".userContentWrapper h5 div span",
			// For pages etc: 900 like this
			".subscribeOrLikeSentence span",
		];
		var spots = [
			// News feed posts
			[ "#stream_pagelet", commonPlaces ],
			// Permalink page with one post
			[ ".permalink_stream", commonPlaces ],
			// Events
			[ ".fbEventWall", commonPlaces ],
			// Groups
			[ "#pagelet_group_mall", commonPlaces ],
			// Pages Feed
			[ "#pagelet_home_stream", commonPlaces ],
			// Timeline
			[ "#pagelet_timeline_main_column", commonPlaces ],
			[ "#pagelet_timeline_main_column", [
				"#fbTimelineHeadline h2 div div", 
				"#pagelet_timeline_page_actions .PageLikeButton input",
				"#fbTimelineNavTopRow .likes.tile div.title span.text",
				".pageFriendSummaryContainer div.headerText span",
				".pageFriendSummaryContainer div.friendInviteHeaderText",
			] ],
			// Navigation on the left, "Like Pages"
			[ "#pagesNav", [ "li.sideNavItem div.linkWrap"] ],
			// Popup when hovering name
			[ ".uiContextualLayerPositioner", [ 
				".pageByline", 
				".uiBoxGray .PageLikeButton input",
				"table tbody tr td div div"
			] ],
			// What the hell is this called? It's on the left in the news feed, with page suggestions
			[ "#pagelet_ego_pane", [ ".egoProfileTemplate div div", ".egoProfileTemplate div a" ] ],
			// Ticker
			[ "div.tickerActivityStories", [ "div.fbFeedTickerStory div.tickerFeedMessage" ] ]
		];

		// Config for how to listen for content changes.
		var config = {
			"childList": true,
			"subtree": true
		};

		// Set that none of the elements are currently being observed.
		var observed = { };
		for (var i = spots.length - 1; i >= 0; i--) {
			observed[spots[i][0]] = false;
		};

		// How to replace text
		var replacements = [
			[ /\b([Ll])ike(s)?\b/, "$1ick$2" ],
			[ /\b([Ll])iked\b/, "$1icked" ],
			[ /^Unlike\b/, "Unlick" ],
			[ /^Like\b/, "Lick" ]
		];

		// Function to start observing
		var observe = function(elementQuery, likeQueries) {
			// Target to observe.
			var target = document.querySelector(elementQuery);
			if (!target) {
				return;
			}

			// Set that we are observing this element.
			// observed[elementQuery] = true;

			// Function that does the actual replace.
			var replace = function(element) {
				// Safety net.
				if (!('querySelectorAll' in element)) {
					return;
				}

				// Search for all the places that might contain the proper words
				var hits = element.querySelectorAll(likeQueries.join(', '));
				for (var i = hits.length - 1; i >= 0; i--) {
					for (var j = replacements.length - 1; j >= 0; j--) {
						// If it's an input, check the value
						if (hits[i].tagName && hits[i].tagName.toLowerCase() == 'input' && hits[i].hasAttribute('value')) {
							hits[i].setAttribute(
								'value',
								hits[i].getAttribute('value').replace(replacements[j][0], replacements[j][1])
							);
						} else {
							// Otherwise, the content
							hits[i].innerHTML = hits[i].innerHTML.replace(replacements[j][0], replacements[j][1]);
						}

						// Like/Unlinks links have title "Like this"/"Unlike this"
						if (hits[i].hasAttribute('title')) {
							hits[i].setAttribute(
								'title',
								hits[i].getAttribute('title').replace(replacements[j][0], replacements[j][1])
							);
						}

					};
				};
			};

			// Create an observer
			var observer = new MutationObserver(function(mutations) {
				mutations.forEach(function(mutation) {
					for (var index = 0; index < mutation.addedNodes.length; ++index) {
						replace(mutation.addedNodes[index]);
					}

					replace(mutation.target);
				});
			});

			// Configure and start observing
			console.log('Started licking', elementQuery)
			observer.observe(target, config);

			// And do an initial replace
			replace(target);
		};

		// For each spot where the word "like" occurs.
		for (var i = 0; i < spots.length; ++i) {
			observe(spots[i][0], spots[i][1]);
		}

		// Wait for unobserved elements to be added.
		var bodyElement = document.body;
		var bodyGlobalObserver = new MutationObserver(function (mutations) {
			mutations.forEach(function(mutation) {
				for (var index = 0; index < mutation.addedNodes.length; ++index) {
					var node = mutation.addedNodes[index];
					if (!('webkitMatchesSelector' in node)) {
						continue;
					}

					// console.log(node);

					// Check if this matches any of our unobserved elements
					for (var query in observed) {
						if (!observed[query]) {
							if (node.webkitMatchesSelector(query)) {
								// Now start observing it!
								// Find matching thingy
								for (var i = spots.length - 1; i >= 0; i--) {
									if (spots[i][0] == query) {
										observe(spots[i][0], spots[i][1]);
										break;
									}
								};
							}
						}
					}
				}
			});
		});
		bodyGlobalObserver.observe(bodyElement, {
			"childList": true,
			"subtree": true
		});
	};

	// Do it, do it nao.
	startLicking();

	// In Facebook, when you switch pages (e.g. news feed -> messages), the page doesn't reload, only the
	// content is replaced. So listen for that and then start licking again.
	var contentElement = document.querySelector('#content');
	var contentGlobalObserver = new MutationObserver(startLicking);
	contentGlobalObserver.observe(contentElement, {
		"childList": true,
		"subtree": false
	});
})();