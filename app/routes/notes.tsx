import type { MetaFunction } from "@remix-run/node";
import { redirect, json } from "@remix-run/node";
import NewNote, { links as newNoteLink } from "~/components/newNotes";
import NoteList, { links as noteListLink } from "~/components/noteList";
import { getStoredNotes, storeNotes } from "~/data/notes";
import {
  useLoaderData,
  isRouteErrorResponse,
  useRouteError,
  Link,
} from "@remix-run/react";

interface Note {
  id: string;
  title: string;
  content: string;
}

export const meta: MetaFunction = () => {
  return [
    { title: "Notes page" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export default function NotesPage() {
  const notes = useLoaderData() as Note[];
  return (
    <main>
      <NewNote />
      <NoteList notes={notes} />
    </main>
  );
}

export async function loader() {
  const notes = await getStoredNotes();
  if (notes.length == 0)
    // throw new Error('Error occurred in SomeComponent');
    return json([
      { message: "Empty notes" },
      { status: 404, statusText: "Not found" },
    ]);
  return notes;
}

export async function action(data: any) {
  const formData = await data.request.formData();
  const noteData = Object.fromEntries(formData);
  if (noteData.title.trim().length < 5) {
    return { message: "Invalid data" };
  }
  const exisitngNotes = await getStoredNotes();
  noteData.id = new Date().toISOString();
  const updatedNotes = exisitngNotes.concat(noteData);
  await storeNotes(updatedNotes);
  //   await new Promise<void>((resolve, reject) =>
  //     setTimeout(() => {
  //       resolve();
  //     }, 1000)
  //   );
  return redirect("/notes");
}

export function ErrorBoundary() {
  const error = useRouteError();
  if (isRouteErrorResponse(error)) {
    return (
      <main className="info-message">
        <h1>Error occurred</h1>
        <h1>
          {error.status} {error.statusText}
        </h1>
        <p>{error?.data}</p>
      </main>
    );
  } else if (error instanceof Error) {
    return (
      <div className="error">
        <h1>Notes error</h1>
        <p>{error.message}</p>
        <p>
          Back to <Link to="/"> safety</Link>!
        </p>
      </div>
    );
  } else {
    return <h1>Unknown Error</h1>;
  }
}
