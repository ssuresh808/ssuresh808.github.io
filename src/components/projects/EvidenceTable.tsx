import { ExternalLink } from '@/components/common/ExternalLink';
import type { Evidence } from '@/lib/schemas/project';

export function EvidenceTable({ evidence }: { evidence: Evidence[] }) {
  if (evidence.length === 0) return null;
  return (
    <section aria-labelledby="evidence-heading" className="mt-10">
      <h2 id="evidence-heading" className="text-2xl font-semibold tracking-tight">
        Evidence at a glance
      </h2>
      <p className="mt-2 text-sm text-muted">
        Every number lists the dataset or run it came from and links to the file in the repo that produced it.
      </p>
      <div className="table-wrap mt-4" tabIndex={0}>
        <table aria-label="Evidence">
          <thead>
            <tr>
              <th scope="col">Measure</th>
              <th scope="col">Value</th>
              <th scope="col">Method</th>
              <th scope="col">Source</th>
            </tr>
          </thead>
          <tbody>
            {evidence.map((e) => (
              <tr key={e.label}>
                <th scope="row" className="font-medium normal-case tracking-normal text-ink">
                  {e.label}
                </th>
                <td className="whitespace-nowrap font-mono">{e.value}</td>
                <td className="text-muted">{e.method}</td>
                <td>
                  {e.sourceUrl ? (
                    <ExternalLink href={e.sourceUrl} className="text-accent underline underline-offset-4">
                      {e.sourceUrl.split('/').slice(-1)[0]}
                    </ExternalLink>
                  ) : (
                    <span className="text-muted">Repo</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
