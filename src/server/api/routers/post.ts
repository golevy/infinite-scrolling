import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { INFINITE_QUERY_LIMIT } from "@/config/infinite-query";

export const postRouter = createTRPCRouter({
  getPosts: publicProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100).nullish(),
        cursor: z.number().nullish(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { cursor } = input;

      const limit = input.limit ?? INFINITE_QUERY_LIMIT;

      const posts = await ctx.db.post.findMany({
        cursor: cursor ? { id: cursor } : undefined,
        take: limit + 1,
      });

      let nextCursor: typeof cursor | undefined = undefined;

      if (posts.length > limit) {
        const nextItem = posts.pop();

        nextCursor = nextItem?.id;
      }

      return {
        posts,
        nextCursor,
      };
    }),
});
