import { zoom } from "../views/content/service/organism/ServiceGrid";
import { services } from "../views/content/service/organism/Services";
import { selectedService } from "../views/content/service/template/ServiceTemplate";

export namespace ServiceGridUtils {
  export function scrollToServiceStart(ref: HTMLDivElement): void {
    const endHour = services().filter(
      (service) => service.id == selectedService()
    )[0].serviceTrips[0].endHour;

    ref.scrollTo((endHour - 25) * zoom(), 0);
  }
}
