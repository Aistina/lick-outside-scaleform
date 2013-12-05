(function (undefined) {
	// Function that kicks everything off.
	var startLicking = function() {
		// Places to observe and where to find the word "like".
		var commonPlaces = [
			// X and Y like this
			".UFILikeSentenceText span span",
			// Like links
			".fbTimelineFeedbackActions a.UFILikeLink",
			"form.commentable_item a.UFILikeLink",
			".ogAggregationSubstoryContent a.UFILikeLink",
			".ogAggregationSubstoryContent .uiLikePage span.action_elem",
			// In news feed: X liked this
			".userContentWrapper h5 div span",
			".storyContent h5.uiStreamMessage",
			".storyContent span.uiLikePageButton span.uiButtonText",
			// On comment: thumbs with number with title: X likes this
			"form.commentable_item a.UFICommentLikeButton",
			// For pages etc: 900 like this
			".subscribeOrLikeSentence span",
			".fbPhotoSubscribeWrapper a",
			".fbPhotoSubscribeWrapper span",
			// Thumb icon (has tooltip)
			"form.commentable_item a.UFILikeThumb.UFIImageBlockImage",
			// Card for when someone liked a page
			".uiStreamAttachments .PageLikeButton .uiButtonText",
			".uiStreamAttachments .PageLikedButton .uiButtonText",
			".uiStreamAttachments ._508a",
			".uiStreamAttachments ._4q7", // Seen @ New Music From Artists You May Like
		];
		var spots = [
			// News feed posts
			[ "#stream_pagelet", commonPlaces ],
			// Permalink page with one post
			[ ".permalink_stream", commonPlaces ],
			// Events
			[ ".fbEventWall", commonPlaces ],
			[ "#pagelet_pinned_posts", commonPlaces ],
			// Groups
			[ "#pagelet_group_mall", commonPlaces ],
			// Music page
			[ "#music_friends", commonPlaces ],
			// Pages Feed
			[ "#pagelet_home_stream", commonPlaces ],
			// Posts in tooltip from ticker
			[ ".tickerDialogContent", commonPlaces ],
			// Photo popup
			[ "#photos_snowlift", commonPlaces ],
			// Timeline
			[ "#pagelet_timeline_main_column", commonPlaces ],
			[ "#pagelet_timeline_main_column", [
				"#fbTimelineHeadline h2 div div",
				"#pagelet_timeline_page_actions .PageLikeButton input",
				"#fbTimelineNavTopRow .likes.tile div.title span.text",
				".pageFriendSummaryContainer div.headerText span",
				".pageFriendSummaryContainer div.friendInviteHeaderText",
				"#pageInviteEscapeHatch h3 span",
				"#pageInviteEscapeHatch a.PageLikeButton",
				"#pageInviteEscapeHatch div.mtm div span",
				".fbTimelineUnit h3 a",
				"#timeline-medley h3 a",
				"#timeline-medley div.fbPhotoStarGridElement div._53k a",
				"#timeline-medley a.uiLinkLightBlue",
				"#timeline-medley div._1_ca span._3sz",
				"#timeline-medley ul.uiList label.PageLikeButton input",
				"#timeline-medley ul.uiList label.PageLikedButton input",
				"#timeline-medley a._42ft",
				"#timeline-medley div._54kt",
			] ],
			// Suggestion to like your favorite pages in Pages Feed
			[ ".megaphone_box", [ ".sourceSuggestionMegaphoneFirstHeader" ] ],
			// Generated pages with Wikipedia content or something
			[ "#pagelet_vertex_header" , [
				"table.uiGrid td._51mw a",
				"table.uiGrid label.PageLikeButton input",
				"table.uiGrid label.PageLikedButton input",
			] ],
			[ "#pagelet_vertex_body", [
				"div._117 a h3",
				"ul.uiList li table td",
				"ul.uiList li table td",
				"ul.uiList li span._69e label.PageLikeButton input",
				"ul.uiList li span._69e label.PageLikedButton input",
				"div._4qd a h3",
				"div._6y9 div._4qa",
				"div._4lv table div._4wc",
			] ],
			// You are posting, commeting, and liking as <your page>
			[ ".pagesVoiceBar", [ ".pagesVoiceBarText" ] ],
			// Navigation on the left, "Like Pages"
			[ "#pagesNav", [ "li.sideNavItem div.linkWrap" ] ],
			// Get more likes for your page
			[ "#boostedPagelikePanel", [
				"h4 div",
				".uiHeaderTop a",
				".adminPanelContentFanAcq div.mts",
				".adminPanelContentFanAcq div.lfloat div._57vm",
			] ],
			// Popup when hovering name, or tooltip for X likes this
			[ ".uiContextualLayerPositioner", [
				".pageByline",
				".uiBoxGray .PageLikeButton input",
				".uiBoxGray .PageLikedButton input",
				"table tbody tr td div div",
				"div.tooltipContent div",
				"div.uiMenu a span",
				"div.isPage a.pageLink",
				"div._54ng a._54nc span span",
				"div.UFILikeSentenceText span span",
				"div.UFICommentActions a.UFILikeLink",
			] ],
			// "Like Pages" page
			[ "._5l27", [
				"div.stat_elem button.PageLikeButton",
				"div.stat_elem div._5l2i", // X likes this
				"div._5sun div._5suq", // Get More Likes for promoting your own page.
			] ],
			// Popup for people who like this
			[ "._59s7", [ "div.lfloat" ] ],
			// What the hell is this called? It's on the right in the news feed, with page suggestions
			[ "#pagelet_ego_pane", [ ".egoProfileTemplate div div", ".egoProfileTemplate div a" ] ],
			// Notifications
			[ "#fbNotificationsFlyout", [ "li div._4l_v > span span" ] ],
			// Ticker
			[ "div.tickerActivityStories", [ "div.fbFeedTickerStory div.tickerFeedMessage" ] ],
			// Advertise on Facebook
			[ "#pagelet_ads_create", [ 
				"ul li._5usz span", 
				"div._5ikp._5k_c div._5iku",
				"div._5ikp._5k_c div._5ikv",
			] ],
			[ "#adscreatorbody", [
				"div._5g5d.NF_DESKTOP_STORY div._5pcs",
				"div._5g5d.RHC_CLASSIC_STANDARD div.fbEmuPreview",
				"div._5sfj table td._480u a span span",
				"div._5sfj table td._480u > div > div > span",
			] ],
		];

		// Config for how to listen for content changes.
		var config = {
			"childList": true,
			"subtree": true
		};

		// How to replace text.
		var replacements = [
			[ /\b([Ll])ike(s)?\b/, "$1ick$2" ],
			[ /\b([Ll])iking\b/, "$1icking" ],
			[ /\b([Ll])iked\b/, "$1icked" ],
			[ /^Unlike\b/, "Unlick" ],
			[ /^Like\b/, "Lick" ]
		];

		// Function to start observing.
		var observe = function(elementQuery, likeQueries, target) {
			// Target to observe.
			target = target || document.querySelector(elementQuery);
			if (!target) {
				return;
			}

			// Function that does the actual replace.
			var replace = function(element) {
				// Safety net.
				if (!('querySelectorAll' in element)) {
					return;
				}

				// Search for all the places that might contain the proper words.
				var hits = element.querySelectorAll(likeQueries.join(', '));
				for (var i = hits.length - 1; i >= 0; i--) {
					for (var j = replacements.length - 1; j >= 0; j--) {
						// If it's an input, check the value.
						if (hits[i].tagName && hits[i].tagName.toLowerCase() == 'input' && hits[i].hasAttribute('value')) {
							hits[i].setAttribute(
								'value',
								hits[i].getAttribute('value').replace(replacements[j][0], replacements[j][1])
							);
						} else {
							// Otherwise, the content.
							hits[i].innerHTML = hits[i].innerHTML.replace(replacements[j][0], replacements[j][1]);
						}

						// Like/Unlinks links have title "Like this"/"Unlike this".
						var attributes = [ "title", "aria-label" ];
						for (var k = attributes.length - 1; k >= 0; k--) {
							if (hits[i].hasAttribute(attributes[k])) {
								hits[i].setAttribute(
									attributes[k],
									hits[i].getAttribute(attributes[k]).replace(replacements[j][0], replacements[j][1])
								);
							}
						}
					}
				}
			};

			// Create an observer.
			var observer = new MutationObserver(function(mutations) {
				mutations.forEach(function(mutation) {
					for (var index = 0; index < mutation.addedNodes.length; ++index) {
						replace(mutation.addedNodes[index]);
					}

					replace(mutation.target);
				});
			});

			// Configure and start observing.
			console.log('Started licking', elementQuery)
			observer.observe(target, config);

			// And do an initial replace.
			replace(target);

			// When the element is removed from the DOM, we can stop the observer.
			target.addEventListener('DOMNodeRemoved', function(mutationEvent) {
				if (mutationEvent.relatedNode == target) {
					console.log('Stopped licking', elementQuery);
					observer.disconnect();
				}
			})
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

					// Check if this matches any of our unobserved elements
					for (var i = spots.length - 1; i >= 0; i--) {
						var target = node;
						if (node.webkitMatchesSelector(spots[i][0]) ||
							(target = node.querySelector(spots[i][0])) != null
						) {
							// Now start observing it!
							// Find matching thingy
							observe(spots[i][0], spots[i][1], target);
							// break;
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
})();
