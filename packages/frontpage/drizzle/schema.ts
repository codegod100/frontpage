import { sqliteTable, AnySQLiteColumn, uniqueIndex, integer, text, foreignKey, index } from "drizzle-orm/sqlite-core"
  import { sql } from "drizzle-orm"

export const betaUsers = sqliteTable("beta_users", {
	id: integer().primaryKey().notNull(),
	createdAt: text("created_at").default("sql`(CURRENT_DATE)`").notNull(),
	did: text().notNull(),
},
(table) => {
	return {
		didUnique: uniqueIndex("beta_users_did_unique").on(table.did),
	}
});

export const comments = sqliteTable("comments", {
	id: integer().primaryKey().notNull(),
	rkey: text().notNull(),
	cid: text().notNull(),
	postId: integer("post_id").notNull().references(() => posts.id),
	body: text({ length: 10000 }).notNull(),
	createdAt: text("created_at").default("sql`(CURRENT_DATE)`").notNull(),
	authorDid: text("author_did").notNull(),
	status: text().default("live"),
	parentCommentId: integer("parent_comment_id"),
},
(table) => {
	return {
		authorDidRkeyUnique: uniqueIndex("comments_author_did_rkey_unique").on(table.authorDid, table.rkey),
		cidUnique: uniqueIndex("comments_cid_unique").on(table.cid),
		commentsParentCommentIdCommentsIdFk: foreignKey(() => ({
			columns: [table.parentCommentId],
			foreignColumns: [table.id],
			name: "comments_parent_comment_id_comments_id_fk"
		})),
	}
});

export const commentVotes = sqliteTable("comment_votes", {
	id: integer().primaryKey().notNull(),
	commentId: integer("comment_id").notNull().references(() => comments.id),
	createdAt: text("created_at").default("sql`(CURRENT_DATE)`").notNull(),
	authorDid: text("author_did").notNull(),
	cid: text().notNull(),
	rkey: text().notNull(),
},
(table) => {
	return {
		authorDidCommentIdUnique: uniqueIndex("comment_votes_author_did_comment_id_unique").on(table.authorDid, table.commentId),
		authorDidRkeyUnique: uniqueIndex("comment_votes_author_did_rkey_unique").on(table.authorDid, table.rkey),
		cidUnique: uniqueIndex("comment_votes_cid_unique").on(table.cid),
	}
});

export const consumedOffsets = sqliteTable("consumed_offsets", {
	offset: integer().primaryKey().notNull(),
});

export const posts = sqliteTable("posts", {
	id: integer().primaryKey().notNull(),
	rkey: text().notNull(),
	cid: text().notNull(),
	title: text({ length: 300 }).notNull(),
	url: text({ length: 255 }).notNull(),
	createdAt: text("created_at").default("sql`(CURRENT_DATE)`").notNull(),
	authorDid: text("author_did").notNull(),
	status: text().default("live"),
},
(table) => {
	return {
		authorDidRkeyUnique: uniqueIndex("posts_author_did_rkey_unique").on(table.authorDid, table.rkey),
		cidUnique: uniqueIndex("posts_cid_unique").on(table.cid),
	}
});

export const postVotes = sqliteTable("post_votes", {
	id: integer().primaryKey().notNull(),
	postId: integer("post_id").notNull().references(() => posts.id),
	createdAt: text("created_at").default("sql`(CURRENT_DATE)`").notNull(),
	authorDid: text("author_did").notNull(),
	cid: text().notNull(),
	rkey: text().notNull(),
},
(table) => {
	return {
		authorDidPostIdUnique: uniqueIndex("post_votes_author_did_post_id_unique").on(table.authorDid, table.postId),
		authorDidRkeyUnique: uniqueIndex("post_votes_author_did_rkey_unique").on(table.authorDid, table.rkey),
		cidUnique: uniqueIndex("post_votes_cid_unique").on(table.cid),
	}
});

export const oauthAuthRequests = sqliteTable("oauth_auth_requests", {
	state: text().notNull(),
	iss: text().notNull(),
	did: text().notNull(),
	username: text().notNull(),
	nonce: text().notNull(),
	pkceVerifier: text("pkce_verifier").notNull(),
	dpopPrivateJwk: text("dpop_private_jwk").notNull(),
	dpopPublicJwk: text("dpop_public_jwk").notNull(),
	expiresAt: text("expires_at").notNull(),
	createdAt: text("created_at").notNull(),
},
(table) => {
	return {
		stateUnique: uniqueIndex("oauth_auth_requests_state_unique").on(table.state),
	}
});

export const oauthSessions = sqliteTable("oauth_sessions", {
	id: integer().primaryKey().notNull(),
	did: text().notNull(),
	username: text().notNull(),
	iss: text().notNull(),
	accessToken: text("access_token").notNull(),
	refreshToken: text("refresh_token").notNull(),
	dpopNonce: text("dpop_nonce").notNull(),
	dpopPrivateJwk: text("dpop_private_jwk").notNull(),
	dpopPublicJwk: text("dpop_public_jwk").notNull(),
	expiresAt: text("expires_at").notNull(),
	createdAt: text("created_at").notNull(),
});

export const adminUsers = sqliteTable("admin_users", {
	id: integer().primaryKey().notNull(),
	createdAt: text("created_at").default("sql`(current_timestamp)`").notNull(),
	did: text().notNull(),
},
(table) => {
	return {
		didUnique: uniqueIndex("admin_users_did_unique").on(table.did),
	}
});

export const labelledProfiles = sqliteTable("labelled_profiles", {
	id: integer().primaryKey().notNull(),
	did: text().notNull(),
	isHidden: integer("is_hidden").default(false).notNull(),
	labels: text(),
	createdAt: text("created_at").default("sql`(current_timestamp)`").notNull(),
	updatedAt: text("updated_at").default("sql`(current_timestamp)`").notNull(),
},
(table) => {
	return {
		didUnique: uniqueIndex("labelled_profiles_did_unique").on(table.did),
	}
});

export const moderationEvents = sqliteTable("moderation_events", {
	id: integer().primaryKey().notNull(),
	subjectUri: text("subject_uri").notNull(),
	subjectDid: text("subject_did").notNull(),
	subjectCollection: text("subject_collection"),
	subjectRkey: text("subject_rkey"),
	subjectCid: text("subject_cid"),
	createdBy: text("created_by").notNull(),
	createdAt: text("created_at").default("sql`(current_timestamp)`").notNull(),
	labelsAdded: text("labels_added"),
	labelsRemoved: text("labels_removed"),
	reportType: text("report_type"),
});

export const reports = sqliteTable("reports", {
	id: integer().primaryKey().notNull(),
	actionedAt: text("actioned_at"),
	actionedBy: text("actioned_by"),
	subjectUri: text("subject_uri").notNull(),
	subjectDid: text("subject_did").notNull(),
	subjectCollection: text("subject_collection"),
	subjectRkey: text("subject_rkey"),
	subjectCid: text("subject_cid"),
	createdBy: text("created_by").notNull(),
	createdAt: text("created_at").default("sql`(current_timestamp)`").notNull(),
	creatorComment: text("creator_comment"),
	reportReason: text("report_reason"),
	status: text().default("pending"),
});

export const commentAggregates = sqliteTable("comment_aggregates", {
	id: integer().primaryKey().notNull(),
	commentId: integer("comment_id").notNull().references(() => comments.id),
	voteCount: integer("vote_count").default(0).notNull(),
	rank: integer().default(sql`(CAST(1 AS REAL) / (pow(2,1.8)))`).notNull(),
	createdAt: text("created_at").default("sql`(strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))`").notNull(),
},
(table) => {
	return {
		commentIdUnique: uniqueIndex("comment_aggregates_comment_id_unique").on(table.commentId),
		commentIdIdx: index("comment_id_idx").on(table.commentId),
	}
});

export const postAggregates = sqliteTable("post_aggregates", {
	id: integer().primaryKey().notNull(),
	postId: integer("post_id").notNull().references(() => posts.id),
	commentCount: integer("comment_count").default(0).notNull(),
	voteCount: integer("vote_count").default(0).notNull(),
	rank: integer().default(sql`(CAST(1 AS REAL) / (pow(2,1.8)))`).notNull(),
	createdAt: text("created_at").default("sql`(strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))`").notNull(),
},
(table) => {
	return {
		postIdUnique: uniqueIndex("post_aggregates_post_id_unique").on(table.postId),
		rankIdx: index("rank_idx").on(table.rank),
		postIdIdx: index("post_id_idx").on(table.postId),
	}
});