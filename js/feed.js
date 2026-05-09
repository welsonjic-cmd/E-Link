function renderPosts() {
    const container = document.getElementById('postsContainer');
    if (!container) return;
    container.innerHTML = '';
    
    // Sort posts with newer posts first, but preserve order for hardcoded dummy ones if we want (for now just render as is)
    posts.forEach(post => {
        const verifiedIcon = post.isVerified ? '<svg width="14" height="14" viewBox="0 0 24 24" fill="#00E5FF" stroke="white" stroke-width="2" style="margin-left: 4px;"><circle cx="12" cy="12" r="10"></circle><path d="M9 12l2 2 4-4"></path></svg>' : '';
        const badgeHTML = post.badge ? `<span style="font-weight: 400; color: var(--text-muted); font-size: 13px;">${post.badge}</span>` : '';
        
        let avatarContent = '';
        if (post.avatar.includes('<svg') || post.avatar.includes('<img')) {
            avatarContent = post.avatar;
        } else {
            avatarContent = post.avatar; // Fallback to letter
        }

        const avatarWrapper = `<div style="width: 48px; height: 48px; background: ${post.avatarBg || 'var(--text-dark)'}; border-radius: ${post.isOrg ? '8px' : '50%'}; display: flex; justify-content: center; align-items: center; color: var(--accent); font-weight: bold; font-size: 20px; overflow: hidden;">${avatarContent}</div>`;
        
        let imageHTML = '';
        if (post.image) {
            imageHTML = `<img src="${post.image}" alt="Post Image" style="width: 100%; height: auto; max-height: 300px; object-fit: cover;">`;
        }

        let jobCardHTML = '';
        if (post.jobCard) {
            jobCardHTML = `
            <div style="background: #f0fbfe; border-top: 1px solid var(--border-subtle); border-bottom: 1px solid var(--border-subtle); padding: 15px; display: flex; align-items: center; gap: 15px; margin: 15px -15px;">
                <div style="width: 40px; height: 40px; display: flex; justify-content: center; align-items: center; font-size: 24px;">
                    ${post.jobCard.icon}
                </div>
                <div style="flex-grow: 1;">
                    <h4 style="margin: 0 0 4px 0; color: #00768c; font-size: 15px; font-weight: 600;">${post.jobCard.title}</h4>
                    <p style="margin: 0; font-size: 13px; color: var(--text-muted);">${post.jobCard.company}</p>
                </div>
                <button class="btn" onclick="applyJob(${post.id})" style="background: #005f73; color: white; border: none; padding: 8px 20px; border-radius: 20px; font-weight: 600; font-size: 14px;">Apply Now</button>
            </div>`;
        }

        let followBtnHTML = '';
        if (post.isFollowing !== undefined) {
            if (post.isFollowing) {
                followBtnHTML = `<button class="btn btn-primary btn-sm" onclick="toggleFollow(${post.id})" style="border-radius: 20px; font-weight: 600; font-size: 14px; display: flex; align-items: center; gap: 4px;">Following</button>`;
            } else {
                followBtnHTML = `<button class="btn btn-outline btn-sm" onclick="toggleFollow(${post.id})" style="border: none; color: var(--accent-text); border-radius: 20px; font-weight: 600; font-size: 14px; display: flex; align-items: center; gap: 4px;"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg> Follow</button>`;
            }
        }

        const card = document.createElement('div');
        card.className = 'post-card card';
        card.style.padding = '0';
        card.innerHTML = `
            <div style="padding: 15px;">
                <div class="post-header" style="justify-content: space-between;">
                    <div style="display: flex; gap: 10px; align-items: center;">
                        ${avatarWrapper}
                        <div class="post-header-info">
                            <h4 style="display: flex; align-items: center;">${post.name} ${badgeHTML} ${verifiedIcon}</h4>
                            <p>${post.followers || 'E-Link Member'}</p>
                            <p>${post.time}</p>
                        </div>
                    </div>
                    ${followBtnHTML}
                    ${!followBtnHTML ? '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="color: var(--text-muted); cursor: pointer;"><circle cx="12" cy="12" r="1"></circle><circle cx="19" cy="12" r="1"></circle><circle cx="5" cy="12" r="1"></circle></svg>' : ''}
                </div>
                <div class="post-content">
                    ${post.content}
                </div>
                ${jobCardHTML}
            </div>
            ${imageHTML}
            <div style="padding: 15px;">
                <div style="display: flex; justify-content: space-between; align-items: center; font-size: 12px; color: var(--text-muted); margin-bottom: 12px;">
                    <div style="display: flex; align-items: center; gap: 4px;">
                        <span style="background: #00E5FF; border-radius: 50%; width: 16px; height: 16px; display: inline-flex; align-items: center; justify-content: center; font-size: 10px; color: white;">👍</span>
                        <span style="background: #ef4444; border-radius: 50%; width: 16px; height: 16px; display: inline-flex; align-items: center; justify-content: center; font-size: 10px; color: white; margin-left: -6px; border: 1px solid white;">🔥</span>
                        <span style="margin-left: 4px;">${post.likes || 0}</span>
                    </div>
                    <div>${post.comments || 0} comments &nbsp;&nbsp; ${post.shares || 0} shares</div>
                </div>
                <div class="post-actions" style="display: flex; justify-content: space-between;">
                    <button class="post-btn" onclick="toggleLike(${post.id})" style="color: ${post.hasLiked ? 'var(--accent-dark)' : 'var(--text-muted)'};"><svg width="18" height="18" viewBox="0 0 24 24" fill="${post.hasLiked ? 'var(--accent)' : 'none'}" stroke="currentColor" stroke-width="2"><path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"></path></svg> <span>Like</span></button>
                    <button class="post-btn" onclick="alert('Comments opening soon')"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg> <span>Comment</span></button>
                    <button class="post-btn" onclick="alert('Shared to your network')"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="18" cy="5" r="3"></circle><circle cx="6" cy="12" r="3"></circle><circle cx="18" cy="19" r="3"></circle><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line></svg> <span>Share</span></button>
                    <button class="post-btn"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg> <span>Send</span></button>
                </div>
            </div>
        `;
        container.appendChild(card);
    });
}

function toggleLike(postId) {
    const post = posts.find(p => p.id === postId);
    if (post) {
        if (post.hasLiked) {
            post.likes--;
            post.hasLiked = false;
        } else {
            post.likes++;
            post.hasLiked = true;
        }
        renderPosts();
    }
}

function toggleFollow(postId) {
    const post = posts.find(p => p.id === postId);
    if (post && post.isFollowing !== undefined) {
        post.isFollowing = !post.isFollowing;
        renderPosts();
    }
}

function applyJob(postId) {
    alert("Application submitted successfully! The organization will review your profile shortly.");
}

function submitPost() {
    if (!currentUser.isVerified && currentUser.postCount >= 1) {
        showSubModal();
        return;
    }

    const input = document.getElementById('postInput');
    if (input && input.value.trim() !== '') {
        const newPost = {
            id: Date.now(),
            name: currentUser.name,
            avatar: currentUser.avatarLetter,
            avatarBg: 'var(--text-dark)',
            isOrg: currentUser.accountType === 'org',
            time: 'Just now',
            followers: currentUser.role,
            content: input.value,
            isVerified: currentUser.isVerified,
            likes: 0,
            comments: 0,
            shares: 0,
            hasLiked: false
        };
        posts.unshift(newPost); // Add to beginning of array
        input.value = '';
        currentUser.postCount++;
        renderPosts();
    }
}
