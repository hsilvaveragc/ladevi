export default function FullWidthProgressBar({ show }) {
  if (!show) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: '50px', // Ajusta esto según la altura de tu header principal
        left: 0,
        right: 0,
        zIndex: 1030,
        height: '6px',
        padding: 0,
        margin: 0,
      }}
    >
      <div
        className='progress'
        style={{
          height: '100%',
          borderRadius: 0,
        }}
      >
        <div
          className='progress-bar progress-bar-striped progress-bar-animated bg-primary'
          role='progressbar'
          style={{ width: '100%' }}
          aria-valuenow='100'
          aria-valuemin='0'
          aria-valuemax='100'
        />
      </div>
    </div>
  );
}
