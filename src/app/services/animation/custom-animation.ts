import {Animation, AnimationController } from "@ionic/angular";

export const customAnimation = (_: HTMLElement, opts: any): Animation => {

    const DURATION = 250;

	const animationCtrl = new AnimationController();

	if (opts.direction === 'forward') {
		return animationCtrl
			.create()
			.addElement(opts.enteringEl)
			.duration(DURATION)
			.easing('ease-in')
			.fromTo('opacity', 0, 1);
	} else {
		const rootAnimation = animationCtrl
			.create()
			.addElement(opts.enteringEl)
			.duration(DURATION)
			.easing('ease-in')
			.fromTo('opacity', 0, 1);

		const leavingAnimation = animationCtrl
			.create()
			.addElement(opts.leaveingEl)
			.duration(DURATION)
			.easing('ease-out')
      		.fromTo('opacity', 1, 0);

      return animationCtrl.create().addAnimation([rootAnimation, leavingAnimation]);
	}
  }