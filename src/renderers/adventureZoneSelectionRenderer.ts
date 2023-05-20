import { AdventureActivityType, AdventureActivity } from "../activities/adventureActivity";
import { Utils } from "../utils"
import { IZone } from "../zones/zone";
import { WoodsZone } from "../zones/woodsZone";
import { CavesZone } from "../zones/caveZone";
import { WildernessZone } from "../zones/wildernessZone";
import { IRenderer } from "./renderer";
import { MessagingBus } from "../messagingBus";

export class AdventureZoneSelectionRenderer implements IRenderer {
    private parent: AdventureActivity;

    constructor(adventureActivity: AdventureActivity)  {
        this.parent = adventureActivity;
    }

    buildDOM(): void {
        const header: HTMLElement = Utils.getHeaderDiv();
        const headerText: HTMLDivElement = document.createElement("div");
        headerText.innerHTML = "Select Zone";
        header.appendChild(headerText);

        const body: HTMLElement = Utils.getContentDiv();
        const zoneContainer: HTMLElement = this.drawZoneBox();
        body.appendChild(zoneContainer);

        zoneContainer.appendChild(this.drawZoneButton(new WoodsZone()));
        zoneContainer.appendChild(this.drawZoneButton(new CavesZone()));
        zoneContainer.appendChild(this.drawZoneButton(new WildernessZone()));
    }

    clearDOM(): void {}

    private drawZoneBox(): HTMLElement {
        const zoneBoxDiv: HTMLDivElement = document.createElement("div");
        zoneBoxDiv.className = "adventuring-zones";

        return zoneBoxDiv;
    }

    private drawZoneButton(zone: IZone): HTMLElement {
        const zoneDiv: HTMLDivElement = document.createElement("div");
        zoneDiv.className = "adventuring-zone-element";
        zoneDiv.onclick = ()=> { 
            MessagingBus.publishToZoneChange(zone); 
            this.parent.buildDOM();
        };

        const nameSpan: HTMLSpanElement = document.createElement("span");
        nameSpan.innerHTML = zone.getName();

        zoneDiv.appendChild(nameSpan);

        const zoneActivitiesDiv = document.createElement("div");
        zoneActivitiesDiv.className = "adventuring-activities";

        zoneDiv.appendChild(zoneActivitiesDiv);

        const activityTypes: ReadonlyArray<AdventureActivityType> = zone.getActivityTypes();
        for (let i: number = 0; i < activityTypes.length; i++) {
            const activityElement: HTMLElement = this.createActivityElement(activityTypes[i]);
            zoneActivitiesDiv.appendChild(activityElement);
        }

        return zoneDiv;
    }

    private createActivityElement(activityType: AdventureActivityType): HTMLElement {
        const activityDiv: HTMLDivElement = document.createElement("div");
        activityDiv.className = "adventure-activity-element";
        activityDiv.innerHTML = AdventureActivityType[activityType];

        return activityDiv;
    }
}