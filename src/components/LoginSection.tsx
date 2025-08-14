// On mount: const user = await getUser(); const notes = await listNotes();
<form onSubmit={async e => { e.preventDefault(); await addNote(input.value); input.value=''; }}>
  <input placeholder="Write a note…" />
  <button type="submit">Add</button>
</form>

<table>
  <thead><tr><th>Note</th><th>Created</th><th></th></tr></thead>
  <tbody>
    {notes.map(n => (
      <tr key={n.id}>
        <td>{n.content}</td>
        <td>{new Date(n.created_at).toLocaleString()}</td>
        <td><button onClick={() => deleteNote(n.id)}>Delete</button></td>
      </tr>
    ))}
  </tbody>
</table>