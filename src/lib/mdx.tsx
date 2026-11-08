import type { ReactNode, ComponentPropsWithoutRef } from 'react';
import { compileMDX } from 'next-mdx-remote/rsc';
import remarkGfm from 'remark-gfm';
import rehypeSlug from 'rehype-slug';

function Anchor({ href = '', children, ...rest }: ComponentPropsWithoutRef<'a'>) {
  const external = /^https?:\/\//.test(href);
  return (
    <a href={href} {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})} {...rest}>
      {children}
      {external ? <span className="sr-only"> (opens in a new tab)</span> : null}
    </a>
  );
}

function Table(props: ComponentPropsWithoutRef<'table'>) {
  return (
    <div className="table-wrap" tabIndex={0}>
      <table {...props} />
    </div>
  );
}

const components = { a: Anchor, table: Table };

/** Compiles trusted local MDX (frontmatter already stripped) to React nodes at build time. */
export async function renderMdx(source: string): Promise<ReactNode> {
  const { content } = await compileMDX({
    source,
    components,
    options: {
      parseFrontmatter: false,
      mdxOptions: { remarkPlugins: [remarkGfm], rehypePlugins: [rehypeSlug] },
    },
  });
  return content;
}
