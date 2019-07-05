export function intervalValidatorGenerator()
{
	let prevTimeStamp: number;
	return function()
	{
		if (!prevTimeStamp)
		{
			prevTimeStamp = Date.now();
			return;
		}
		console.log(Date.now() - prevTimeStamp);
		prevTimeStamp = Date.now();
	}
}