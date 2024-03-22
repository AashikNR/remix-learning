import { Link, useLoaderData } from "@remix-run/react";
import styles from "~/styles/note-details.css";
import { getStoredNotes } from "~/data/notes";
import type { MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";

interface Note {
  id: string;
  title: string;
  content: string;
}

interface Params {
  id: string;
}

export const meta: MetaFunction<any> = ({data}) => {
  return [
    { title: data.title },
    { name: "description", content: "Welcome to Remix!" },
  ];
}

export default function NoteDetailsPage() {
  const notes = useLoaderData() as Note;
  return (
    <main id="note-details">
      <header>
        <nav>
          <Link to="/notes">All Notes</Link>
        </nav>
        <h1>{notes.title}</h1>
      </header>
      <p id="note-details-content">{notes.content}</p>
    </main>
  );
}

export const loader = async ({
  request,
  params,
}: {
  request: Request;
  params: Params;
}) => {
  const notes: Note[] = await getStoredNotes();
  const requestedNote = notes.find((note: Note) => note.id === params.id);
  if (!requestedNote) {
    throw new Error(`Note with id ${params.id} not found`);
    // return json([
    //   { message: `Note with id ${params.id} not found` },
    //   { status: 404, statusText: "Not found" },
    // ]);
  }
  return requestedNote;
};

export function links() {
  return [{ rel: "stylesheet", href: styles }];
}
