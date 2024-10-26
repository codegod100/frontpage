import { relations } from "drizzle-orm/relations";
import { comments, posts, commentVotes, postVotes, commentAggregates, postAggregates } from "./schema";

export const commentsRelations = relations(comments, ({one, many}) => ({
	comment: one(comments, {
		fields: [comments.parentCommentId],
		references: [comments.id],
		relationName: "comments_parentCommentId_comments_id"
	}),
	comments: many(comments, {
		relationName: "comments_parentCommentId_comments_id"
	}),
	post: one(posts, {
		fields: [comments.postId],
		references: [posts.id]
	}),
	commentVotes: many(commentVotes),
	commentAggregates: many(commentAggregates),
}));

export const postsRelations = relations(posts, ({many}) => ({
	comments: many(comments),
	postVotes: many(postVotes),
	postAggregates: many(postAggregates),
}));

export const commentVotesRelations = relations(commentVotes, ({one}) => ({
	comment: one(comments, {
		fields: [commentVotes.commentId],
		references: [comments.id]
	}),
}));

export const postVotesRelations = relations(postVotes, ({one}) => ({
	post: one(posts, {
		fields: [postVotes.postId],
		references: [posts.id]
	}),
}));

export const commentAggregatesRelations = relations(commentAggregates, ({one}) => ({
	comment: one(comments, {
		fields: [commentAggregates.commentId],
		references: [comments.id]
	}),
}));

export const postAggregatesRelations = relations(postAggregates, ({one}) => ({
	post: one(posts, {
		fields: [postAggregates.postId],
		references: [posts.id]
	}),
}));