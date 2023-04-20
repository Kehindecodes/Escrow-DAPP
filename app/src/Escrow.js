export default function Escrow({
	address,
	arbiter,
	beneficiary,
	value,
	approved,
	handleApprove,
	id,
}) {
	return (
		<div className='existing-contract'>
			<ul className='fields'>
				<li>
					<div> Arbiter </div>
					<div> {arbiter} </div>
				</li>
				<li>
					<div> Beneficiary </div>
					<div> {beneficiary} </div>
				</li>
				<li>
					<div> Value </div>
					<div> {value} </div>
				</li>
				{approved === true ? (
					<p className='complete'>✓ It's been approved!</p>
				) : (
					<div
						className='button'
						id={address}
						onClick={(e) => {
							e.preventDefault();

							handleApprove(id);
						}}>
						Approve
					</div>
				)}
			</ul>
		</div>
	);
}
